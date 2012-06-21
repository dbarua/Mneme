	    /**
	     * utility.js methods you might need:
	     * If you get stuck, check out expandos-simple.js
		addEventSimple(element, eventType, function)
		hasClass(element, className)
		addClass(element, className)
		removeClass(element, className)
		getElementsByClass(className) 
	     
	     CSS classes you might need(from ../demos/expandos.css):
		wd-expando-on
		wd-expando-off
	     */

	    // get all the expando containers by a class name
	   var expandos = getElementsByClass('wd-expando');

	    for (var i = 0; i < expandos.length; i++) {
	      var expando = expandos[i];
	      addClass(expando, 'wd-expando-on');
	      var header = expando.getElementsByTagName('h2')[0];
	      addEventSimple(header, 'click', toggleExpando);
	    }
	    
	    function toggleExpando () {
	      var expando = this.parentNode;
	      if (hasClass(expando, 'wd-expando-on')) {
		removeClass(expando, 'wd-expando-on');
		addClass(expando, 'wd-expando-off');
	      } else {
		removeClass(expando, 'wd-expando-off');
		addClass(expando, 'wd-expando-on');
	      }
	    }

