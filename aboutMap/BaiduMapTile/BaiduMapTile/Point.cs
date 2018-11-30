using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BaiduMapTile
{
    public struct Point
    {
        public int x;
        public int y;

        public Point(int x, int y)
        {
            this.x = x;
            this.y = y;
        }
    }

    public struct PointGeo
    {
        public double lng;
        public double lat;

        public PointGeo(double lng, double lat)
        {
            this.lng = lng;
            this.lat = lat;
        }
    }

    public struct PointF
    {
        public double x;
        public double y;

        public PointF(double x, double y)
        {
            this.x = x;
            this.y = y;
        }

    }


}
