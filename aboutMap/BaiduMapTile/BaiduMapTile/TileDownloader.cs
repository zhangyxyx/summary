using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Net;
using System.IO;

namespace BaiduMapTile
{
    public class TileDownloader
    {
        static public String[] MAP_HOSTS =
                    { 
                 //"http://or.map.bdimg.com:8080/tile/", 
                 //"http://or0.map.bdimg.com:8080/tile/",
                 //"http://or1.map.bdimg.com:8080/tile/", 
                 //"http://or2.map.bdimg.com:8080/tile/",
                 //"http://or3.map.bdimg.com:8080/tile/",
                 "http://or.map.bdimg.com/tile/", 
                 "http://or0.map.bdimg.com/tile/",
                 "http://or1.map.bdimg.com/tile/", 
                 "http://or2.map.bdimg.com/tile/",
                 "http://or3.map.bdimg.com/tile/",

                 "http://online0.map.bdimg.com/tile/", 
                 "http://online1.map.bdimg.com/tile/", 
                 "http://online2.map.bdimg.com/tile/", 
                 "http://online3.map.bdimg.com/tile/", 
                 "http://online4.map.bdimg.com/tile/"
                 };

        static private String MAP_TILE_DIR = "maptile\\";      //瓦片图
        //static private String PANO_TILE_DIR = "PanoTile/";          //全景

        static public int DOWNLOAD_STATE_DOWNLOADING = 0;
        static public int DOWNLOAD_STATE_STOP = 1;

        private FormMain mUi;

        private String mBaseDir;
        private PointGeo mLeftBottomPoint;
        private PointGeo mrightTopPoint;
        private List<int> mZoomArray;
        private int mThreadCnt;
        private int mMapType;

        private String mBaseMapTileDir;
        private int mErrorCnt;
        private List<Thread> mThreads;

        private bool mStop;

        //瓦片总数和已下载的瓦片数
        private int mTotalTile;
        private int mDownloadedTile;

        //中间变量
        int mX = 0, mY = 0, mZ = 0;
        Point mLeftBottomTile;
        Point mRightTopTile;

        public TileDownloader(FormMain form)
        {
            mUi = form;
        }

        public void execute(String baseDir, PointGeo leftBottomPoint, PointGeo rightTopPoint, List<int> zoomArray, int threadCnt, int mapType)
        {
            mBaseDir = baseDir;

            if (mBaseDir.EndsWith("\\"))
            {
                mBaseMapTileDir = mBaseDir + MAP_TILE_DIR;
            }
            else
            {
                mBaseMapTileDir = mBaseDir + "\\" + MAP_TILE_DIR;
            }            

            // 经纬度 缩放级别
            mLeftBottomPoint = leftBottomPoint;
            mrightTopPoint = rightTopPoint;
            mZoomArray = zoomArray;
            mThreadCnt = threadCnt;
            mThreads = new List<Thread>();
            mMapType = mapType;

            mErrorCnt = 0;
            mTotalTile = 0;
            mDownloadedTile = 0;

            mStop = false;

            //创建目录
            Util.createDir(mBaseMapTileDir);

            //计算瓦片数
            mTotalTile = getTileTotal();
            
            //初始化任务
            initTask(0);
            //开始下载
            for (int i = 0; i < mThreadCnt; i++)
            {
                //ThreadPool.QueueUserWorkItem(new WaitCallback(TaskProc), i);

                Thread t = new Thread(new ParameterizedThreadStart(TaskProc));
                mThreads.Add(t);
                t.Start(i);
            }

        }

        public void stop()
        {
            mStop = true;
        }
        
        private void TaskProc(object o)
        {
            int id = Convert.ToInt32(o);

            DownloadTask task;

            while (!mStop)
            {
                task = getTask();
                if (task.x < 0)
                {
                    break;
                }


                //文件已经存在
                if (Util.isFileExists(task.file))
                {
                    ++mDownloadedTile;

                    updateProgress(mDownloadedTile, mTotalTile, DOWNLOAD_STATE_DOWNLOADING);

                    String strLog = "[已下载/瓦片总数：" +
                        mDownloadedTile + "/" + mTotalTile + "，放大：" +
                        task.z + "/" + mZoomArray[mZoomArray.Count - 1] + "，横向：" +
                        task.x + "/" + mRightTopTile.x + "，纵向：" +
                        task.y + "/" + mRightTopTile.y + "]" +
                        " => " + task.file;
                    setStatusText(strLog + " Exist");
                    Console.Write(strLog + " Exist\n");
                    continue;
                }

                int i = 0;
                for(; i < 5; i++)
                {
                    if(download(task.url, task.file))
                    {
                        ++mDownloadedTile;

                        updateProgress(mDownloadedTile, mTotalTile, DOWNLOAD_STATE_DOWNLOADING);
                        
                        String strLog = "[已下载/瓦片总数：" +
                            mDownloadedTile + "/" + mTotalTile + "，放大：" +
                            task.z + "/" + mZoomArray[mZoomArray.Count - 1] + "，横向：" +
                            task.x + "/" + mRightTopTile.x + "，纵向：" +
                            task.y + "/" + mRightTopTile.y + "]" +
                            " => " + task.file;
                        setStatusText(strLog);
                        Console.Write(strLog + "\n");
                        break;
                    }
                    else
                    {
                        Util.log("Retry["+i+"]" + task.url);
                    }
                }
                
                if(i >= 5)
                {
                    ++mErrorCnt;
                }
                
                if(mErrorCnt >= 20)
                {
                    break;
                }
                
            }
            
            Util.log("Thread[" + id + "] completed. Error = " + mErrorCnt);

            int aliveCnt = 0;
            foreach(Thread t in mThreads)
            {
                if (t.IsAlive)
                {
                    ++aliveCnt;
                }
            }

            if (aliveCnt <= 1)
            {
                updateProgress(mDownloadedTile, mTotalTile, DOWNLOAD_STATE_STOP);
            }
        }

        private struct DownloadTask
        {
            public String url;
            public String file;
            public int x, y, z;
        }

        public int getTileTotal()
        {
            int total = 0;

            for (int i = 0; i < mZoomArray.Count; i++)
            {
                initTask(i);
                for (int x = mLeftBottomTile.x; x <= mRightTopTile.x; x++)
                {
                    for (int y = mLeftBottomTile.y; y <= mRightTopTile.y; y++)
                    {
                        ++total;
                    }
                }
            }
            initTask(0);

            return total;
        }

        //计算总的瓦片数
        private void initTask(int zoomIndex)
        {
            mZ = zoomIndex;

            mLeftBottomTile = MapTool.lngLatToTile(mLeftBottomPoint.lng, mLeftBottomPoint.lat, mZoomArray[mZ]);
            mRightTopTile = MapTool.lngLatToTile(mrightTopPoint.lng, mrightTopPoint.lat, mZoomArray[mZ]);

            mX = mLeftBottomTile.x;
            mY = mLeftBottomTile.y;
        }
        
        private static Object synchronizeVariable = "locking variable";
        private DownloadTask getTask()
        {
            lock (synchronizeVariable)
            { 
                DownloadTask task = new DownloadTask();
                
                for (; mZ < mZoomArray.Count; )
                {
                    if (!Util.createDir(mBaseMapTileDir + mZoomArray[mZ] + "/"))
                    {
                        task.x = -1;
                        return task;
                    }
                    
                    for (; mX <= mRightTopTile.x; mX++)
                    {
                        if (!Util.createDir(mBaseMapTileDir + mZoomArray[mZ] + "/" + mX + "/"))
                        {
                            task.x = -1;
                            return task;
                        }

                        for (; mY <= mRightTopTile.y; )
                        {
                            int hostid = Math.Abs(mX + mY) % MAP_HOSTS.Length;
                            String host = MAP_HOSTS[hostid];

                            if (mMapType == 0)
                            {
                                //街道图（png） http://online0.map.bdimg.com/tile/?qt=tile&x=6536&y=1797&z=15&styles=pl
                                task.url = host + "?qt=tile&x=" + mX + "&y=" + mY + "&z=" + mZoomArray[mZ] + "&styles=pl";
                                task.file = mBaseMapTileDir + mZoomArray[mZ] + "\\" + mX + "\\" + mY + ".png";
                            }
                            else
                            {
                                //卫星图（jpg） http://shangetu3.map.bdimg.com/it/u=x=52295;y=14383;z=18;v=009;type=sate&fm=46
                                task.url = "http://shangetu3.map.bdimg.com/it/u=x=" + mX + ";y=" + mY + ";z=" + mZoomArray[mZ] + ";v=009;type=sate&fm=46";
                                task.file = mBaseMapTileDir + mZoomArray[mZ] + "\\" + mX + "\\" + mY + ".jpg";
                            }
                            //路网（有问题） http://or2.map.bdimg.com:8080/tile/?qt=tile&x=52294&y=14384&z=18&styles=sl


                            task.x = mX;
                            task.y = mY;
                            task.z = mZoomArray[mZ];

                            mY++;
                            
                            //String strLog = "[" + 
                            //    mDownloadedTile + "/" + mTotalTile + "," + 
                            //    mZoomArray[mZ] + "/" + mZoomArray[mZoomArray.Count - 1] + "," + 
                            //    mX + "/" + mRightTopTile.x + "," + 
                            //    mY + "/" + mRightTopTile.y + "]" + 
                            //    " => " + task.file;

                            //if(Util.isFileExists(task.file))
                            //{
                            //    mDownloadedTile++;
                            //    setStatusText(strLog + " Exist");
                            //    continue;
                            //}
                            //else
                            //{
                            //    setStatusText(strLog);
                            //}
                            
                            return task;
                        }
                        
                        if(mY > mRightTopTile.y)
                        {
                            mY = mLeftBottomTile.y;
                        }
                    }

                    if (mX > mRightTopTile.x && mZ + 1 < mZoomArray.Count)
                    {
                        initTask(++mZ);
                    }
                    else if (mZ + 1 >= mZoomArray.Count)
                    {
                        break;
                    }
                }

                task.x = -1;
                return task;
            }
        }
        
        private bool download(String urlString, String fileString)
        {
            try
            {
                Uri u = new Uri(urlString);
                HttpWebRequest mRequest = (HttpWebRequest)WebRequest.Create(u);
                mRequest.Method = "GET";
                mRequest.ContentType = "application/x-www-form-urlencoded";

                HttpWebResponse wr = (HttpWebResponse)mRequest.GetResponse();

                Stream sIn = wr.GetResponseStream();
                FileStream fs = new FileStream(fileString, FileMode.Create, FileAccess.Write);

                long length = wr.ContentLength;

                byte[] buffer = new byte[1024 * 40];
                do
                {
                    int len = sIn.Read(buffer, 0, buffer.Length); ;
                    if (len <= 0)
                    {
                        // 下载完成
                        break;
                    }
                    fs.Write(buffer, 0, len);

                } while (true);

                sIn.Close();
                wr.Close();
                fs.Close();
            }
            catch (Exception)
            {
                Util.log("download failed");
                return false;
            }

            return true;
        }

        private void setStatusText(string msg)
        {
            if (mUi != null)
            {
                mUi.setStatusText(msg);
            }
        }

        private void updateProgress(int total, int completed, int state)
        {
            if (mUi != null)
            {
                mUi.UpdateProgress(total, completed, state);
            }
        }

    }

}
