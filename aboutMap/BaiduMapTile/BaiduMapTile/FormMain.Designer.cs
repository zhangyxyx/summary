namespace BaiduMapTile
{
    partial class FormMain
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.button_start = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.textBox_left_bottom_lat = new System.Windows.Forms.TextBox();
            this.textBox_right_top_lng = new System.Windows.Forms.TextBox();
            this.checkBox_z1 = new System.Windows.Forms.CheckBox();
            this.checkBox_z2 = new System.Windows.Forms.CheckBox();
            this.checkBox_z3 = new System.Windows.Forms.CheckBox();
            this.checkBox_z4 = new System.Windows.Forms.CheckBox();
            this.checkBox_z5 = new System.Windows.Forms.CheckBox();
            this.checkBox_z6 = new System.Windows.Forms.CheckBox();
            this.checkBox_z7 = new System.Windows.Forms.CheckBox();
            this.checkBox_z8 = new System.Windows.Forms.CheckBox();
            this.checkBox_z9 = new System.Windows.Forms.CheckBox();
            this.checkBox_z10 = new System.Windows.Forms.CheckBox();
            this.checkBox_z11 = new System.Windows.Forms.CheckBox();
            this.checkBox_z12 = new System.Windows.Forms.CheckBox();
            this.checkBox_z13 = new System.Windows.Forms.CheckBox();
            this.checkBox_z14 = new System.Windows.Forms.CheckBox();
            this.checkBox_z15 = new System.Windows.Forms.CheckBox();
            this.checkBox_z16 = new System.Windows.Forms.CheckBox();
            this.checkBox_z17 = new System.Windows.Forms.CheckBox();
            this.checkBox_z18 = new System.Windows.Forms.CheckBox();
            this.numericUpDown_downlaod_thread_cnt = new System.Windows.Forms.NumericUpDown();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.radio_satellite_map = new System.Windows.Forms.RadioButton();
            this.radio_street_map = new System.Windows.Forms.RadioButton();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.label8 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.textBox_right_top_lat = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.textBox_left_bottom_lng = new System.Windows.Forms.TextBox();
            this.radioButton_map_lng_lat = new System.Windows.Forms.RadioButton();
            this.radioButton_map_box = new System.Windows.Forms.RadioButton();
            this.groupBox5 = new System.Windows.Forms.GroupBox();
            this.textBox_maptile_dir = new System.Windows.Forms.TextBox();
            this.button_open_maptile_dir = new System.Windows.Forms.Button();
            this.label4 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.button_pause = new System.Windows.Forms.Button();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.toolStripStatusLabel_download_status = new System.Windows.Forms.ToolStripStatusLabel();
            this.toolStripStatusLabel2 = new System.Windows.Forms.ToolStripStatusLabel();
            this.toolStripStatusLabel3 = new System.Windows.Forms.ToolStripStatusLabel();
            this.toolStripStatusLabel_map_status = new System.Windows.Forms.ToolStripStatusLabel();
            this.tabPage1 = new System.Windows.Forms.TabPage();
            this.webBrowser_map_online = new System.Windows.Forms.WebBrowser();
            this.tabControl_map = new System.Windows.Forms.TabControl();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDown_downlaod_thread_cnt)).BeginInit();
            this.groupBox2.SuspendLayout();
            this.groupBox3.SuspendLayout();
            this.groupBox4.SuspendLayout();
            this.groupBox5.SuspendLayout();
            this.statusStrip.SuspendLayout();
            this.tabPage1.SuspendLayout();
            this.tabControl_map.SuspendLayout();
            this.SuspendLayout();
            // 
            // button_start
            // 
            this.button_start.Location = new System.Drawing.Point(12, 598);
            this.button_start.Margin = new System.Windows.Forms.Padding(4);
            this.button_start.Name = "button_start";
            this.button_start.Size = new System.Drawing.Size(144, 40);
            this.button_start.TabIndex = 0;
            this.button_start.Text = "开始";
            this.button_start.UseVisualStyleBackColor = true;
            this.button_start.Click += new System.EventHandler(this.button_start_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(15, 79);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(52, 15);
            this.label1.TabIndex = 1;
            this.label1.Text = "左下角";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(15, 138);
            this.label2.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(52, 15);
            this.label2.TabIndex = 2;
            this.label2.Text = "右上角";
            // 
            // textBox_left_bottom_lat
            // 
            this.textBox_left_bottom_lat.Location = new System.Drawing.Point(189, 99);
            this.textBox_left_bottom_lat.Margin = new System.Windows.Forms.Padding(4);
            this.textBox_left_bottom_lat.MaxLength = 20;
            this.textBox_left_bottom_lat.Name = "textBox_left_bottom_lat";
            this.textBox_left_bottom_lat.Size = new System.Drawing.Size(105, 25);
            this.textBox_left_bottom_lat.TabIndex = 4;
            // 
            // textBox_right_top_lng
            // 
            this.textBox_right_top_lng.Location = new System.Drawing.Point(45, 156);
            this.textBox_right_top_lng.Margin = new System.Windows.Forms.Padding(4);
            this.textBox_right_top_lng.MaxLength = 20;
            this.textBox_right_top_lng.Name = "textBox_right_top_lng";
            this.textBox_right_top_lng.Size = new System.Drawing.Size(105, 25);
            this.textBox_right_top_lng.TabIndex = 5;
            // 
            // checkBox_z1
            // 
            this.checkBox_z1.AutoSize = true;
            this.checkBox_z1.Location = new System.Drawing.Point(17, 25);
            this.checkBox_z1.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z1.Name = "checkBox_z1";
            this.checkBox_z1.Size = new System.Drawing.Size(37, 19);
            this.checkBox_z1.TabIndex = 8;
            this.checkBox_z1.Text = "1";
            this.checkBox_z1.UseVisualStyleBackColor = true;
            // 
            // checkBox_z2
            // 
            this.checkBox_z2.AutoSize = true;
            this.checkBox_z2.Location = new System.Drawing.Point(64, 25);
            this.checkBox_z2.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z2.Name = "checkBox_z2";
            this.checkBox_z2.Size = new System.Drawing.Size(37, 19);
            this.checkBox_z2.TabIndex = 9;
            this.checkBox_z2.Text = "2";
            this.checkBox_z2.UseVisualStyleBackColor = true;
            // 
            // checkBox_z3
            // 
            this.checkBox_z3.AutoSize = true;
            this.checkBox_z3.Location = new System.Drawing.Point(111, 25);
            this.checkBox_z3.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z3.Name = "checkBox_z3";
            this.checkBox_z3.Size = new System.Drawing.Size(37, 19);
            this.checkBox_z3.TabIndex = 10;
            this.checkBox_z3.Text = "3";
            this.checkBox_z3.UseVisualStyleBackColor = true;
            // 
            // checkBox_z4
            // 
            this.checkBox_z4.AutoSize = true;
            this.checkBox_z4.Location = new System.Drawing.Point(157, 25);
            this.checkBox_z4.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z4.Name = "checkBox_z4";
            this.checkBox_z4.Size = new System.Drawing.Size(37, 19);
            this.checkBox_z4.TabIndex = 11;
            this.checkBox_z4.Text = "4";
            this.checkBox_z4.UseVisualStyleBackColor = true;
            // 
            // checkBox_z5
            // 
            this.checkBox_z5.AutoSize = true;
            this.checkBox_z5.Location = new System.Drawing.Point(204, 25);
            this.checkBox_z5.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z5.Name = "checkBox_z5";
            this.checkBox_z5.Size = new System.Drawing.Size(37, 19);
            this.checkBox_z5.TabIndex = 12;
            this.checkBox_z5.Text = "5";
            this.checkBox_z5.UseVisualStyleBackColor = true;
            // 
            // checkBox_z6
            // 
            this.checkBox_z6.AutoSize = true;
            this.checkBox_z6.Location = new System.Drawing.Point(251, 25);
            this.checkBox_z6.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z6.Name = "checkBox_z6";
            this.checkBox_z6.Size = new System.Drawing.Size(37, 19);
            this.checkBox_z6.TabIndex = 13;
            this.checkBox_z6.Text = "6";
            this.checkBox_z6.UseVisualStyleBackColor = true;
            // 
            // checkBox_z7
            // 
            this.checkBox_z7.AutoSize = true;
            this.checkBox_z7.Location = new System.Drawing.Point(17, 52);
            this.checkBox_z7.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z7.Name = "checkBox_z7";
            this.checkBox_z7.Size = new System.Drawing.Size(37, 19);
            this.checkBox_z7.TabIndex = 14;
            this.checkBox_z7.Text = "7";
            this.checkBox_z7.UseVisualStyleBackColor = true;
            // 
            // checkBox_z8
            // 
            this.checkBox_z8.AutoSize = true;
            this.checkBox_z8.Location = new System.Drawing.Point(64, 52);
            this.checkBox_z8.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z8.Name = "checkBox_z8";
            this.checkBox_z8.Size = new System.Drawing.Size(37, 19);
            this.checkBox_z8.TabIndex = 15;
            this.checkBox_z8.Text = "8";
            this.checkBox_z8.UseVisualStyleBackColor = true;
            // 
            // checkBox_z9
            // 
            this.checkBox_z9.AutoSize = true;
            this.checkBox_z9.Location = new System.Drawing.Point(111, 52);
            this.checkBox_z9.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z9.Name = "checkBox_z9";
            this.checkBox_z9.Size = new System.Drawing.Size(37, 19);
            this.checkBox_z9.TabIndex = 16;
            this.checkBox_z9.Text = "9";
            this.checkBox_z9.UseVisualStyleBackColor = true;
            // 
            // checkBox_z10
            // 
            this.checkBox_z10.AutoSize = true;
            this.checkBox_z10.Location = new System.Drawing.Point(157, 52);
            this.checkBox_z10.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z10.Name = "checkBox_z10";
            this.checkBox_z10.Size = new System.Drawing.Size(45, 19);
            this.checkBox_z10.TabIndex = 17;
            this.checkBox_z10.Text = "10";
            this.checkBox_z10.UseVisualStyleBackColor = true;
            // 
            // checkBox_z11
            // 
            this.checkBox_z11.AutoSize = true;
            this.checkBox_z11.Location = new System.Drawing.Point(204, 52);
            this.checkBox_z11.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z11.Name = "checkBox_z11";
            this.checkBox_z11.Size = new System.Drawing.Size(45, 19);
            this.checkBox_z11.TabIndex = 18;
            this.checkBox_z11.Text = "11";
            this.checkBox_z11.UseVisualStyleBackColor = true;
            // 
            // checkBox_z12
            // 
            this.checkBox_z12.AutoSize = true;
            this.checkBox_z12.Location = new System.Drawing.Point(251, 52);
            this.checkBox_z12.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z12.Name = "checkBox_z12";
            this.checkBox_z12.Size = new System.Drawing.Size(45, 19);
            this.checkBox_z12.TabIndex = 19;
            this.checkBox_z12.Text = "12";
            this.checkBox_z12.UseVisualStyleBackColor = true;
            // 
            // checkBox_z13
            // 
            this.checkBox_z13.AutoSize = true;
            this.checkBox_z13.Location = new System.Drawing.Point(17, 80);
            this.checkBox_z13.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z13.Name = "checkBox_z13";
            this.checkBox_z13.Size = new System.Drawing.Size(45, 19);
            this.checkBox_z13.TabIndex = 20;
            this.checkBox_z13.Text = "13";
            this.checkBox_z13.UseVisualStyleBackColor = true;
            // 
            // checkBox_z14
            // 
            this.checkBox_z14.AutoSize = true;
            this.checkBox_z14.Location = new System.Drawing.Point(64, 80);
            this.checkBox_z14.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z14.Name = "checkBox_z14";
            this.checkBox_z14.Size = new System.Drawing.Size(45, 19);
            this.checkBox_z14.TabIndex = 21;
            this.checkBox_z14.Text = "14";
            this.checkBox_z14.UseVisualStyleBackColor = true;
            // 
            // checkBox_z15
            // 
            this.checkBox_z15.AutoSize = true;
            this.checkBox_z15.Location = new System.Drawing.Point(111, 80);
            this.checkBox_z15.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z15.Name = "checkBox_z15";
            this.checkBox_z15.Size = new System.Drawing.Size(45, 19);
            this.checkBox_z15.TabIndex = 22;
            this.checkBox_z15.Text = "15";
            this.checkBox_z15.UseVisualStyleBackColor = true;
            // 
            // checkBox_z16
            // 
            this.checkBox_z16.AutoSize = true;
            this.checkBox_z16.Location = new System.Drawing.Point(157, 80);
            this.checkBox_z16.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z16.Name = "checkBox_z16";
            this.checkBox_z16.Size = new System.Drawing.Size(45, 19);
            this.checkBox_z16.TabIndex = 23;
            this.checkBox_z16.Text = "16";
            this.checkBox_z16.UseVisualStyleBackColor = true;
            // 
            // checkBox_z17
            // 
            this.checkBox_z17.AutoSize = true;
            this.checkBox_z17.Location = new System.Drawing.Point(204, 80);
            this.checkBox_z17.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z17.Name = "checkBox_z17";
            this.checkBox_z17.Size = new System.Drawing.Size(45, 19);
            this.checkBox_z17.TabIndex = 24;
            this.checkBox_z17.Text = "17";
            this.checkBox_z17.UseVisualStyleBackColor = true;
            // 
            // checkBox_z18
            // 
            this.checkBox_z18.AutoSize = true;
            this.checkBox_z18.Location = new System.Drawing.Point(251, 80);
            this.checkBox_z18.Margin = new System.Windows.Forms.Padding(4);
            this.checkBox_z18.Name = "checkBox_z18";
            this.checkBox_z18.Size = new System.Drawing.Size(45, 19);
            this.checkBox_z18.TabIndex = 25;
            this.checkBox_z18.Text = "18";
            this.checkBox_z18.UseVisualStyleBackColor = true;
            // 
            // numericUpDown_downlaod_thread_cnt
            // 
            this.numericUpDown_downlaod_thread_cnt.Location = new System.Drawing.Point(104, 25);
            this.numericUpDown_downlaod_thread_cnt.Margin = new System.Windows.Forms.Padding(4);
            this.numericUpDown_downlaod_thread_cnt.Maximum = new decimal(new int[] {
            20,
            0,
            0,
            0});
            this.numericUpDown_downlaod_thread_cnt.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.numericUpDown_downlaod_thread_cnt.Name = "numericUpDown_downlaod_thread_cnt";
            this.numericUpDown_downlaod_thread_cnt.Size = new System.Drawing.Size(107, 25);
            this.numericUpDown_downlaod_thread_cnt.TabIndex = 29;
            this.numericUpDown_downlaod_thread_cnt.ThousandsSeparator = true;
            this.numericUpDown_downlaod_thread_cnt.Value = new decimal(new int[] {
            10,
            0,
            0,
            0});
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.checkBox_z18);
            this.groupBox2.Controls.Add(this.checkBox_z17);
            this.groupBox2.Controls.Add(this.checkBox_z16);
            this.groupBox2.Controls.Add(this.checkBox_z15);
            this.groupBox2.Controls.Add(this.checkBox_z14);
            this.groupBox2.Controls.Add(this.checkBox_z13);
            this.groupBox2.Controls.Add(this.checkBox_z12);
            this.groupBox2.Controls.Add(this.checkBox_z11);
            this.groupBox2.Controls.Add(this.checkBox_z10);
            this.groupBox2.Controls.Add(this.checkBox_z9);
            this.groupBox2.Controls.Add(this.checkBox_z8);
            this.groupBox2.Controls.Add(this.checkBox_z7);
            this.groupBox2.Controls.Add(this.checkBox_z6);
            this.groupBox2.Controls.Add(this.checkBox_z5);
            this.groupBox2.Controls.Add(this.checkBox_z4);
            this.groupBox2.Controls.Add(this.checkBox_z3);
            this.groupBox2.Controls.Add(this.checkBox_z2);
            this.groupBox2.Controls.Add(this.checkBox_z1);
            this.groupBox2.Location = new System.Drawing.Point(12, 220);
            this.groupBox2.Margin = new System.Windows.Forms.Padding(4);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Padding = new System.Windows.Forms.Padding(4);
            this.groupBox2.Size = new System.Drawing.Size(308, 119);
            this.groupBox2.TabIndex = 33;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "放大级别";
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.radio_satellite_map);
            this.groupBox3.Controls.Add(this.radio_street_map);
            this.groupBox3.Location = new System.Drawing.Point(12, 372);
            this.groupBox3.Margin = new System.Windows.Forms.Padding(4);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Padding = new System.Windows.Forms.Padding(4);
            this.groupBox3.Size = new System.Drawing.Size(308, 74);
            this.groupBox3.TabIndex = 34;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "下载内容";
            // 
            // radio_satellite_map
            // 
            this.radio_satellite_map.AutoSize = true;
            this.radio_satellite_map.Location = new System.Drawing.Point(157, 36);
            this.radio_satellite_map.Name = "radio_satellite_map";
            this.radio_satellite_map.Size = new System.Drawing.Size(73, 19);
            this.radio_satellite_map.TabIndex = 3;
            this.radio_satellite_map.TabStop = true;
            this.radio_satellite_map.Text = "卫星图";
            this.radio_satellite_map.UseVisualStyleBackColor = true;
            // 
            // radio_street_map
            // 
            this.radio_street_map.AutoSize = true;
            this.radio_street_map.Location = new System.Drawing.Point(18, 36);
            this.radio_street_map.Name = "radio_street_map";
            this.radio_street_map.Size = new System.Drawing.Size(73, 19);
            this.radio_street_map.TabIndex = 2;
            this.radio_street_map.TabStop = true;
            this.radio_street_map.Text = "街道图";
            this.radio_street_map.UseVisualStyleBackColor = true;
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.label8);
            this.groupBox4.Controls.Add(this.label7);
            this.groupBox4.Controls.Add(this.textBox_right_top_lat);
            this.groupBox4.Controls.Add(this.label6);
            this.groupBox4.Controls.Add(this.label5);
            this.groupBox4.Controls.Add(this.textBox_left_bottom_lng);
            this.groupBox4.Controls.Add(this.radioButton_map_lng_lat);
            this.groupBox4.Controls.Add(this.radioButton_map_box);
            this.groupBox4.Controls.Add(this.textBox_right_top_lng);
            this.groupBox4.Controls.Add(this.textBox_left_bottom_lat);
            this.groupBox4.Controls.Add(this.label2);
            this.groupBox4.Controls.Add(this.label1);
            this.groupBox4.Location = new System.Drawing.Point(12, 15);
            this.groupBox4.Margin = new System.Windows.Forms.Padding(4);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Padding = new System.Windows.Forms.Padding(4);
            this.groupBox4.Size = new System.Drawing.Size(308, 198);
            this.groupBox4.TabIndex = 35;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "经纬度范围";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(161, 161);
            this.label8.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(22, 15);
            this.label8.TabIndex = 15;
            this.label8.Text = "纬";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(15, 161);
            this.label7.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(22, 15);
            this.label7.TabIndex = 14;
            this.label7.Text = "经";
            // 
            // textBox_right_top_lat
            // 
            this.textBox_right_top_lat.Location = new System.Drawing.Point(189, 156);
            this.textBox_right_top_lat.Margin = new System.Windows.Forms.Padding(4);
            this.textBox_right_top_lat.MaxLength = 20;
            this.textBox_right_top_lat.Name = "textBox_right_top_lat";
            this.textBox_right_top_lat.Size = new System.Drawing.Size(105, 25);
            this.textBox_right_top_lat.TabIndex = 13;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(161, 102);
            this.label6.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(22, 15);
            this.label6.TabIndex = 12;
            this.label6.Text = "纬";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(13, 102);
            this.label5.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(22, 15);
            this.label5.TabIndex = 11;
            this.label5.Text = "经";
            // 
            // textBox_left_bottom_lng
            // 
            this.textBox_left_bottom_lng.Location = new System.Drawing.Point(44, 99);
            this.textBox_left_bottom_lng.Margin = new System.Windows.Forms.Padding(4);
            this.textBox_left_bottom_lng.MaxLength = 20;
            this.textBox_left_bottom_lng.Name = "textBox_left_bottom_lng";
            this.textBox_left_bottom_lng.Size = new System.Drawing.Size(105, 25);
            this.textBox_left_bottom_lng.TabIndex = 10;
            // 
            // radioButton_map_lng_lat
            // 
            this.radioButton_map_lng_lat.AutoSize = true;
            this.radioButton_map_lng_lat.Location = new System.Drawing.Point(16, 52);
            this.radioButton_map_lng_lat.Margin = new System.Windows.Forms.Padding(4);
            this.radioButton_map_lng_lat.Name = "radioButton_map_lng_lat";
            this.radioButton_map_lng_lat.Size = new System.Drawing.Size(103, 19);
            this.radioButton_map_lng_lat.TabIndex = 9;
            this.radioButton_map_lng_lat.TabStop = true;
            this.radioButton_map_lng_lat.Text = "指定经纬度";
            this.radioButton_map_lng_lat.UseVisualStyleBackColor = true;
            this.radioButton_map_lng_lat.CheckedChanged += new System.EventHandler(this.radioButton_map_lng_lat_CheckedChanged);
            // 
            // radioButton_map_box
            // 
            this.radioButton_map_box.AutoSize = true;
            this.radioButton_map_box.Location = new System.Drawing.Point(16, 25);
            this.radioButton_map_box.Margin = new System.Windows.Forms.Padding(4);
            this.radioButton_map_box.Name = "radioButton_map_box";
            this.radioButton_map_box.Size = new System.Drawing.Size(118, 19);
            this.radioButton_map_box.TabIndex = 8;
            this.radioButton_map_box.TabStop = true;
            this.radioButton_map_box.Text = "在地图上画框";
            this.radioButton_map_box.UseVisualStyleBackColor = true;
            this.radioButton_map_box.CheckedChanged += new System.EventHandler(this.radioButton_map_box_CheckedChanged);
            // 
            // groupBox5
            // 
            this.groupBox5.Controls.Add(this.textBox_maptile_dir);
            this.groupBox5.Controls.Add(this.button_open_maptile_dir);
            this.groupBox5.Controls.Add(this.label4);
            this.groupBox5.Controls.Add(this.label3);
            this.groupBox5.Controls.Add(this.numericUpDown_downlaod_thread_cnt);
            this.groupBox5.Location = new System.Drawing.Point(12, 469);
            this.groupBox5.Margin = new System.Windows.Forms.Padding(4);
            this.groupBox5.Name = "groupBox5";
            this.groupBox5.Padding = new System.Windows.Forms.Padding(4);
            this.groupBox5.Size = new System.Drawing.Size(308, 121);
            this.groupBox5.TabIndex = 30;
            this.groupBox5.TabStop = false;
            this.groupBox5.Text = "下载参数";
            // 
            // textBox_maptile_dir
            // 
            this.textBox_maptile_dir.Location = new System.Drawing.Point(16, 84);
            this.textBox_maptile_dir.Margin = new System.Windows.Forms.Padding(4);
            this.textBox_maptile_dir.Name = "textBox_maptile_dir";
            this.textBox_maptile_dir.Size = new System.Drawing.Size(227, 25);
            this.textBox_maptile_dir.TabIndex = 33;
            // 
            // button_open_maptile_dir
            // 
            this.button_open_maptile_dir.Location = new System.Drawing.Point(251, 82);
            this.button_open_maptile_dir.Margin = new System.Windows.Forms.Padding(4);
            this.button_open_maptile_dir.Name = "button_open_maptile_dir";
            this.button_open_maptile_dir.Size = new System.Drawing.Size(45, 29);
            this.button_open_maptile_dir.TabIndex = 32;
            this.button_open_maptile_dir.Text = "...";
            this.button_open_maptile_dir.UseVisualStyleBackColor = true;
            this.button_open_maptile_dir.Click += new System.EventHandler(this.button_open_maptile_dir_Click);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(13, 59);
            this.label4.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(67, 15);
            this.label4.TabIndex = 31;
            this.label4.Text = "保存目录";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(13, 30);
            this.label3.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(67, 15);
            this.label3.TabIndex = 30;
            this.label3.Text = "线程个数";
            // 
            // button_pause
            // 
            this.button_pause.Location = new System.Drawing.Point(176, 598);
            this.button_pause.Margin = new System.Windows.Forms.Padding(4);
            this.button_pause.Name = "button_pause";
            this.button_pause.Size = new System.Drawing.Size(144, 40);
            this.button_pause.TabIndex = 1;
            this.button_pause.Text = "停止";
            this.button_pause.UseVisualStyleBackColor = true;
            this.button_pause.Click += new System.EventHandler(this.button_pause_Click);
            // 
            // statusStrip
            // 
            this.statusStrip.ImageScalingSize = new System.Drawing.Size(20, 20);
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.toolStripStatusLabel_download_status,
            this.toolStripStatusLabel2,
            this.toolStripStatusLabel3,
            this.toolStripStatusLabel_map_status});
            this.statusStrip.Location = new System.Drawing.Point(0, 646);
            this.statusStrip.Name = "statusStrip";
            this.statusStrip.Padding = new System.Windows.Forms.Padding(1, 0, 19, 0);
            this.statusStrip.Size = new System.Drawing.Size(981, 25);
            this.statusStrip.TabIndex = 36;
            this.statusStrip.Text = "statusStrip1";
            // 
            // toolStripStatusLabel_download_status
            // 
            this.toolStripStatusLabel_download_status.Name = "toolStripStatusLabel_download_status";
            this.toolStripStatusLabel_download_status.Size = new System.Drawing.Size(69, 20);
            this.toolStripStatusLabel_download_status.Text = "准备就绪";
            // 
            // toolStripStatusLabel2
            // 
            this.toolStripStatusLabel2.Name = "toolStripStatusLabel2";
            this.toolStripStatusLabel2.Size = new System.Drawing.Size(0, 20);
            // 
            // toolStripStatusLabel3
            // 
            this.toolStripStatusLabel3.BorderSides = System.Windows.Forms.ToolStripStatusLabelBorderSides.Right;
            this.toolStripStatusLabel3.Name = "toolStripStatusLabel3";
            this.toolStripStatusLabel3.Size = new System.Drawing.Size(823, 20);
            this.toolStripStatusLabel3.Spring = true;
            // 
            // toolStripStatusLabel_map_status
            // 
            this.toolStripStatusLabel_map_status.Name = "toolStripStatusLabel_map_status";
            this.toolStripStatusLabel_map_status.Size = new System.Drawing.Size(69, 20);
            this.toolStripStatusLabel_map_status.Text = "放大级别";
            // 
            // tabPage1
            // 
            this.tabPage1.Controls.Add(this.webBrowser_map_online);
            this.tabPage1.Location = new System.Drawing.Point(4, 25);
            this.tabPage1.Margin = new System.Windows.Forms.Padding(4);
            this.tabPage1.Name = "tabPage1";
            this.tabPage1.Padding = new System.Windows.Forms.Padding(4);
            this.tabPage1.Size = new System.Drawing.Size(645, 600);
            this.tabPage1.TabIndex = 0;
            this.tabPage1.Text = "在线地图";
            this.tabPage1.UseVisualStyleBackColor = true;
            // 
            // webBrowser_map_online
            // 
            this.webBrowser_map_online.Dock = System.Windows.Forms.DockStyle.Fill;
            this.webBrowser_map_online.Location = new System.Drawing.Point(4, 4);
            this.webBrowser_map_online.Margin = new System.Windows.Forms.Padding(4);
            this.webBrowser_map_online.MinimumSize = new System.Drawing.Size(27, 25);
            this.webBrowser_map_online.Name = "webBrowser_map_online";
            this.webBrowser_map_online.Size = new System.Drawing.Size(637, 592);
            this.webBrowser_map_online.TabIndex = 0;
            this.webBrowser_map_online.Url = new System.Uri("", System.UriKind.Relative);
            this.webBrowser_map_online.DocumentCompleted += new System.Windows.Forms.WebBrowserDocumentCompletedEventHandler(this.webBrowser_map_online_DocumentCompleted);
            // 
            // tabControl_map
            // 
            this.tabControl_map.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.tabControl_map.Controls.Add(this.tabPage1);
            this.tabControl_map.Location = new System.Drawing.Point(328, 15);
            this.tabControl_map.Margin = new System.Windows.Forms.Padding(4);
            this.tabControl_map.Name = "tabControl_map";
            this.tabControl_map.SelectedIndex = 0;
            this.tabControl_map.Size = new System.Drawing.Size(653, 629);
            this.tabControl_map.TabIndex = 37;
            // 
            // FormMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(981, 671);
            this.Controls.Add(this.tabControl_map);
            this.Controls.Add(this.statusStrip);
            this.Controls.Add(this.button_pause);
            this.Controls.Add(this.button_start);
            this.Controls.Add(this.groupBox5);
            this.Controls.Add(this.groupBox4);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox2);
            this.Margin = new System.Windows.Forms.Padding(4);
            this.Name = "FormMain";
            this.Padding = new System.Windows.Forms.Padding(0, 8, 0, 0);
            this.Text = "百度离线地图下载器";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDown_downlaod_thread_cnt)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            this.groupBox5.ResumeLayout(false);
            this.groupBox5.PerformLayout();
            this.statusStrip.ResumeLayout(false);
            this.statusStrip.PerformLayout();
            this.tabPage1.ResumeLayout(false);
            this.tabControl_map.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button button_start;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox textBox_left_bottom_lat;
        private System.Windows.Forms.TextBox textBox_right_top_lng;
        private System.Windows.Forms.CheckBox checkBox_z1;
        private System.Windows.Forms.CheckBox checkBox_z2;
        private System.Windows.Forms.CheckBox checkBox_z3;
        private System.Windows.Forms.CheckBox checkBox_z4;
        private System.Windows.Forms.CheckBox checkBox_z5;
        private System.Windows.Forms.CheckBox checkBox_z6;
        private System.Windows.Forms.CheckBox checkBox_z7;
        private System.Windows.Forms.CheckBox checkBox_z8;
        private System.Windows.Forms.CheckBox checkBox_z9;
        private System.Windows.Forms.CheckBox checkBox_z10;
        private System.Windows.Forms.CheckBox checkBox_z11;
        private System.Windows.Forms.CheckBox checkBox_z12;
        private System.Windows.Forms.CheckBox checkBox_z13;
        private System.Windows.Forms.CheckBox checkBox_z14;
        private System.Windows.Forms.CheckBox checkBox_z15;
        private System.Windows.Forms.CheckBox checkBox_z16;
        private System.Windows.Forms.CheckBox checkBox_z17;
        private System.Windows.Forms.CheckBox checkBox_z18;
        private System.Windows.Forms.NumericUpDown numericUpDown_downlaod_thread_cnt;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.GroupBox groupBox5;
        private System.Windows.Forms.TextBox textBox_maptile_dir;
        private System.Windows.Forms.Button button_open_maptile_dir;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button button_pause;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel_download_status;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel2;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel3;
        private System.Windows.Forms.ToolStripStatusLabel toolStripStatusLabel_map_status;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.TextBox textBox_right_top_lat;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox textBox_left_bottom_lng;
        private System.Windows.Forms.RadioButton radioButton_map_lng_lat;
        private System.Windows.Forms.RadioButton radioButton_map_box;
        private System.Windows.Forms.RadioButton radio_satellite_map;
        private System.Windows.Forms.RadioButton radio_street_map;
        private System.Windows.Forms.TabPage tabPage1;
        private System.Windows.Forms.WebBrowser webBrowser_map_online;
        private System.Windows.Forms.TabControl tabControl_map;
    }
}

