//https://github.com/protobi/js-xlsx
var defaultCellStyle = {
	font: {
		name: "微软雅黑",
		sz: 12,
		color: {
			rgb:"FF000000"
		}
	}
};

var standardDataCell = {
	font: {
		name: "微软雅黑",
		sz: 12,
		color: {
			rgb:"FF000000"
		}
	},
	"alignment": {
		"horizontal": "center",
		"vertical": "center",
		wrapText:false
	}
}

var standardHeaderCell = {
	font: {
		name: "微软雅黑",
		sz: 12,
		color: {
			rgb:"FFFFFFFF"
		}
	},
	fill: {
		fgColor: {
			rgb: "FF00B2D8"
		}
	},
	"alignment": {
	    "horizontal": "center",
	    "vertical": "center"
	  }
}

function setCell(val,horizon, ifWrap) {
	var cellObj = {
		v:val,
		t:'s',
		s:{
			font: {
				name: "微软雅黑",
				sz: 12,
				color: {
					rgb:"FF000000"
				}
			},
			"alignment": {
				"horizontal": horizon || 'center',
				"vertical": "center",
				wrapText:ifWrap
			}
		}
	}
	
	return cellObj;
}

function setHeader(val,cellStyle) {
	var cellObj = {
		v:val,
		t:'s',
		s:cellStyle || standardHeaderCell
	}
	
	return cellObj;
}

function _s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for(var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

function exportExcel(fileName, sheetData) {
	var wbout = XLSX.writeFile(sheetData, '', {
		defaultCellStyle: defaultCellStyle,
		type: 'binary'
	});
	saveAs(new Blob([_s2ab(wbout)], {
		type: "application/octet-stream"
	}), fileName + ".xlsx")
}