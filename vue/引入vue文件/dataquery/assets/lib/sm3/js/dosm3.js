function doSM3(val) {
		var msgData = CryptoJS.enc.Utf8.parse(val);

		var md;
		var sm3keycur = new SM3Digest();
		msgData = sm3keycur.GetWords(msgData.toString());

		sm3keycur.BlockUpdate(msgData, 0, msgData.length);

		var c3 = new Array(32);
		sm3keycur.DoFinal(c3, 0);
		var hashHex = sm3keycur.GetHex(c3).toString();

		//return(hashHex.toUpperCase());
		return(hashHex);
	}