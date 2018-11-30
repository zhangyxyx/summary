using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace BaiduMapTile
{
    class Util
    {
        static public bool isFileExists(String filePath)
        {
            //return new File(filePath).Exists();
            return File.Exists(@filePath);
        }

        static private Object synchronizeVariable = "locking variable";
        static public bool createDir(String filePath)
        {
            lock (synchronizeVariable)
            {
                //File file = new File(filePath);
                if (Directory.Exists(@filePath))
                {
                    return true;
                }
                else
                {
                    DirectoryInfo info = Directory.CreateDirectory(filePath);

                    //Console.Write("Create dir failed: " + filePath);
                    return true;
                }
            }
        }

        static public void log(String content)
        {
            Console.Write(content + "\n");
        }

    }
}
