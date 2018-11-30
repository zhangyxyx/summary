using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BaiduMapTile
{
    class MapTool
    {
        static private int[] Wm = { 75, 60, 45, 30, 15, 0 };

        static private double[][] bv = new double[][]{
            new double[]{-0.0015702102444, 111320.7020616939, 1704480524535203L, -10338987376042340L, 26112667856603880L, -35149669176653700L, 26595700718403920L, -10725012454188240L, 1800819912950474L, 82.5},
            new double[]{8.277824516172526E-4, 111320.7020463578, 6.477955746671607E8, -4.082003173641316E9, 1.077490566351142E10, -1.517187553151559E10, 1.205306533862167E10, -5.124939663577472E9, 9.133119359512032E8, 67.5},
            new double[]{0.00337398766765, 111320.7020202162, 4481351.045890365, -2.339375119931662E7, 7.968221547186455E7, -1.159649932797253E8, 9.723671115602145E7, -4.366194633752821E7, 8477230.501135234, 52.5},
            new double[]{0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5},
            new double[]{-3.441963504368392E-4, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5},
            new double[]{-3.218135878613132E-4, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45}
	    };

        static public Point pointToPixel(PointF pt, int zoom)
        {
            Point pt3 = new Point();
            pt3.x = (int)Math.Floor(pt.x * Math.Pow(2, zoom - 18));
            pt3.y = (int)Math.Floor(pt.y * Math.Pow(2, zoom - 18));

            return pt3;
        }

        static public Point pixelToTile(Point pt)
        {
            Point pt4 = new Point();
            pt4.x = (int)Math.Floor(pt.x * 1.0 / 256);
            pt4.y = (int)Math.Floor(pt.y * 1.0 / 256);

            return pt4;
        }

        static public Point lngLatToTile(double lng, double lat, int zoom)
        {
            return pixelToTile(pointToPixel(lngLatToPoint(lng, lat), zoom));
        }

        static public PointF lngLatToPoint(double lng, double lat)
        {
            PointGeo pt = new PointGeo();

            pt.lng = MapTool.ft(lng, -180, 180);  // lng: 120.26007
            pt.lat = MapTool.lt(lat, -74, 74);    // lat: 31.554487


            //b = new F(a.lng, a.lat);            // b: lat: 31.554487  lng: 120.26007

            double[] c = null;
            //北纬
            for (int d = 0; d < MapTool.Wm.Length; d++)
            {
                if (pt.lat >= MapTool.Wm[d])
                {
                    // Wm: [75, 60, 45, 30, 15, 0] （常量）
                    c = MapTool.bv[d];                 // bv: 10*6的二维数组（常量）
                    break;
                }
            }

            //南纬
            if (c.Length <= 0)
            {
                for (int d = MapTool.Wm.Length; 0 <= d; d--)
                {
                    if (pt.lat <= -MapTool.Wm[d])
                    {
                        c = MapTool.bv[d];
                        break;
                    }
                }
            }

            PointF fpt = MapTool.Sx(pt, c); //a:  lat: 31.554487   lng: 120.26007,   c = this.bv[d];  (d = 3)
            return new PointF(Convert.ToDouble(fpt.x.ToString("0.00")), Convert.ToDouble(fpt.y.ToString("0.00")));
            //DecimalFormat df = new DecimalFormat("#.00");
            //return new PointF(Double.parseDouble(df.format(fpt.x)), Double.parseDouble(df.format(fpt.y))); // a: lat: 3682405.23  lng: 13387435.42

        }

        static private PointF Sx(PointGeo a, double[] b)
        {
            double c = b[0] + b[1] * Math.Abs(a.lng); // c: 13387435.419690479
            double d = Math.Abs(a.lat) / b[9];
            double e = b[2] + b[3] * d + b[4] * d * d + b[5] * d * d * d + b[6] * d * d * d * d + b[7] * d * d * d * d * d + b[8] * d * d * d * d * d * d; // d: 3682405.2310994808
            double f = c * (0 > a.lng ? -1 : 1);  // c: 13387435.419690479
            double g = e * (0 > a.lat ? -1 : 1);  // d: 3682405.2310994808
            return new PointF(f, g);
        }

        //如果经度大于180或者小于-180，将经度调整到-180到180之间
        static private double ft(double a, int b, int c)
        {
            for (; a > c; ) a -= c - b;
            for (; a < b; ) a += c - b;
            return a;
        }

        //将纬度调整到-74~74之间
        static private double lt(double a, int b, int c)
        {
            //        b != n && (a = Math.max(a, b));
            //        c != n && (a = Math.min(a, c));

            a = Math.Max(a, b);
            a = Math.Min(a, c);

            return a;
        }

    }
}
