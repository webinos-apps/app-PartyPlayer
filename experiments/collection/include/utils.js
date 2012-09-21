function cloneObject(source) {
    for (i in source) {
        if (typeof source[i] == 'source') {
            this[i] = new cloneObject(source[i]);
        }
        else{
            this[i] = source[i];
	}
    }
}


/**
function replacer(key, value) {
	  if (typeof value === 'number' && !isFinite(value)) {
	 	return String(value);
	  }
};
**/


exports.cloneObject = cloneObject

