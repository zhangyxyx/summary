using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
//在js中调用ShowMessage函数需加这句
using System.Security.Permissions;

namespace BaiduMapTile
{
    //在js中调用ShowMessage函数需加这句
    [PermissionSet(SecurityAction.Demand, Name = "FullTrust")]
    [System.Runtime.InteropServices.ComVisibleAttribute(true)]
    public partial class FormMain : Form
    {
        private int[] mZoom = new int[18];
        private CheckBox[] mCheckBoxZoom = new CheckBox[18];
        private TileDownloader mDownloader;

        public FormMain()
        {
            InitializeComponent();

            //在js中调用ShowMessage函数需加这句
            webBrowser_map_online.ObjectForScripting = this;

            //范围
            this.radioButton_map_lng_lat.Checked = true;
            this.radioButton_map_box.Checked = false;

            //缩放级别
            mCheckBoxZoom[0] = this.checkBox_z1;
            mCheckBoxZoom[1] = this.checkBox_z2;
            mCheckBoxZoom[2] = this.checkBox_z3;
            mCheckBoxZoom[3] = this.checkBox_z4;
            mCheckBoxZoom[4] = this.checkBox_z5;
            mCheckBoxZoom[5] = this.checkBox_z6;
            mCheckBoxZoom[6] = this.checkBox_z7;
            mCheckBoxZoom[7] = this.checkBox_z8;
            mCheckBoxZoom[8] = this.checkBox_z9;
            mCheckBoxZoom[9] = this.checkBox_z10;
            mCheckBoxZoom[10] = this.checkBox_z11;
            mCheckBoxZoom[11] = this.checkBox_z12;
            mCheckBoxZoom[12] = this.checkBox_z13;
            mCheckBoxZoom[13] = this.checkBox_z14;
            mCheckBoxZoom[14] = this.checkBox_z15;
            mCheckBoxZoom[15] = this.checkBox_z16;
            mCheckBoxZoom[16] = this.checkBox_z17;
            mCheckBoxZoom[17] = this.checkBox_z18;

            for (int i = 0; i < mCheckBoxZoom.Length; i++)
            {
                mCheckBoxZoom[i].Checked = true;
            }

            //下载类型
            this.radio_street_map.Checked = true;

            //F:\project\cs\BaiduMapTile\html
            string workPath = System.IO.Directory.GetCurrentDirectory();
            //this.webBrowser_map_online.Url = new Uri(workPath + "/html/online.html");
            //this.webBrowser_offline.Url = new Uri(workPath + "/html/offline.html");
            this.webBrowser_map_online.Url = new Uri(workPath + "/../../../html/在线地图.html");

            this.textBox_maptile_dir.Text = workPath;

            mDownloader = new TileDownloader(this);
        }

        //在js中调用此函数 begin
        public void ShowMessage(string message)
        {
            MessageBox.Show("C# invoke ShowMessage: " + message);
        }

        public void SetScale(double lng1, double lat1, double lng2, double lat2)
        {
            this.textBox_left_bottom_lng.Text = Convert.ToString(lng1);
            this.textBox_left_bottom_lat.Text = Convert.ToString(lat1);
            this.textBox_right_top_lng.Text = Convert.ToString(lng2);
            this.textBox_right_top_lat.Text = Convert.ToString(lat2);
        }
        //end

        public void SetBounds2(string lng1)
        {
            this.textBox_left_bottom_lng.Text = Convert.ToString(lng1);
        }
        
        private void button_start_Click(object sender, EventArgs e)
        {
            if (this.textBox_left_bottom_lng.Text == ""
                || this.textBox_left_bottom_lat.Text == ""
                || this.textBox_right_top_lng.Text == ""
                || this.textBox_right_top_lat.Text == "")
            {
                MessageBox.Show("请输入经纬度，或者划定要下载的区域");
                return;
            }

            //经纬度范围
            double lng = Convert.ToDouble(this.textBox_left_bottom_lng.Text);
            double lat = Convert.ToDouble(this.textBox_left_bottom_lat.Text);
            PointGeo leftBottomPoint = new PointGeo(lng, lat); // 左下角

            lng = Convert.ToDouble(this.textBox_right_top_lng.Text);
            lat = Convert.ToDouble(this.textBox_right_top_lat.Text);
            PointGeo rightTopPoint = new PointGeo(lng, lat); // 右上角

            if(leftBottomPoint.lng == rightTopPoint.lng
                || leftBottomPoint.lat == rightTopPoint.lat)
            {
                MessageBox.Show("两个经度或者纬度不能一样");
                return;
            }

            //放大级别
            List<int> zoomArray = new List<int>();
            for (int i = 0; i < mCheckBoxZoom.Length; i++)
            {
                if (mCheckBoxZoom[i].Checked)
                {
                    zoomArray.Add(i + 1);
                }
            }

            if(zoomArray.Count == 0)
            {
                MessageBox.Show("请选择放大级别");
                return;
            }

            //下载内容
            int mapType = 0;
            if(this.radio_street_map.Checked) //街道图
            {
                mapType = 0;
            }
            else if(this.radio_satellite_map.Checked) //卫星图
            {
                mapType = 1;
            }
            else
            {
                mapType = 0;
            }

            //线程数
            int threadCnt = Convert.ToInt16(numericUpDown_downlaod_thread_cnt.Value);

            //保存路径
            String savePath = this.textBox_maptile_dir.Text;
            if (savePath == null || savePath.Length == 0)
            {
                MessageBox.Show("请设置保存目录");
                return;
            }

            this.toolStripStatusLabel_download_status.Text = "开始下载";
            
            mDownloader.execute(savePath, leftBottomPoint, rightTopPoint, zoomArray, threadCnt, mapType);

            this.button_start.Enabled = false;
            this.button_pause.Enabled = true;
        }

        private void button_pause_Click(object sender, EventArgs e)
        {
            if (mDownloader != null)
            {
                mDownloader.stop();
            }

            this.button_pause.Text = "正在停止";
        }

        public delegate void SetStatusTextCallback(string msg);

        public void setStatusText(string msg)
        {
            //把鼠标放上去看解释就知道了，就是防止创建控件以外的线程调用（.NET是类型安全的）
            if (this.statusStrip.InvokeRequired)
            {
                //为当前控件指定委托
                SetStatusTextCallback d = new SetStatusTextCallback(setStatusText);
                this.Invoke(d, new object[] { msg });

                //this.Invoke(new addms g(AddMsg), msg);
            }
            else
            {
                //被委托到主线程后真正执行的代码
                //为什么会执行到这里？
                //不好解释，大概是因为委托的主线程后，this.InvokeRequired=false了吧
                this.toolStripStatusLabel_download_status.Text = msg;
            }
        }

        public delegate void UpdateProgressCallback(int total, int completed, int state);
        public void UpdateProgress(int total, int completed, int state)
        {
            if (this.statusStrip.InvokeRequired)
            {
                UpdateProgressCallback d = new UpdateProgressCallback(UpdateProgress);
                this.Invoke(d, new object[] { total, completed, state });
                return;
            }

            if (total == completed || state == TileDownloader.DOWNLOAD_STATE_STOP)
            {
                this.button_start.Enabled = true;
                this.button_pause.Enabled = false;

                if (total == completed)
                {
                    this.toolStripStatusLabel_download_status.Text = "下载完成";
                }
                else
                {
                    this.toolStripStatusLabel_download_status.Text = "下载停止";
                }
                this.button_pause.Text = "停止";
            }


        }


        //在地图上画框
        private void radioButton_map_box_CheckedChanged(object sender, EventArgs e)
        {
            this.textBox_left_bottom_lng.Enabled = false;
            this.textBox_left_bottom_lat.Enabled = false;
            this.textBox_right_top_lng.Enabled = false;
            this.textBox_right_top_lat.Enabled = false;

            this.webBrowser_map_online.Document.InvokeScript("OpenDrawRect");
        }

        //指定经纬度
        private void radioButton_map_lng_lat_CheckedChanged(object sender, EventArgs e)
        {
            this.textBox_left_bottom_lng.Enabled = true;
            this.textBox_left_bottom_lat.Enabled = true;
            this.textBox_right_top_lng.Enabled = true;
            this.textBox_right_top_lat.Enabled = true;

            this.webBrowser_map_online.Document.InvokeScript("CloseDrawRect");
        }

        private void webBrowser_map_online_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            if (this.radioButton_map_box.Checked == true)
            {
                this.webBrowser_map_online.Document.InvokeScript("OpenDrawRect");
            }
            else
            {
                this.webBrowser_map_online.Document.InvokeScript("CloseDrawRect");
            }
        }

        //设置保存路径
        private void button_open_maptile_dir_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog folderBrowser = new FolderBrowserDialog();
            //folderBrowser.SelectedPath = @"c:/"; //　设置打开目录选择对话框时默认的目录 
            folderBrowser.SelectedPath = System.IO.Directory.GetCurrentDirectory();
            folderBrowser.ShowNewFolderButton = true; //是否显示新建文件夹按钮 
            folderBrowser.Description = "请选择保存地图数据的目录";//描述弹出框功能 
            folderBrowser.RootFolder = Environment.SpecialFolder.MyComputer;　// 打开到我的文档 

            if (folderBrowser.ShowDialog() == DialogResult.OK)
            {
                this.textBox_maptile_dir.Text = folderBrowser.SelectedPath;
            }
        }


    }
}
