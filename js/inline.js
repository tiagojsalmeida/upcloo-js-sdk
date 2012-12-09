(function(global){
	
	var upCloo = global.upCloo;
		Inline = function(elem){
		
			this.data = false;
			this.siteKey = false;
			this.vSiteKey = false;
			this.options = {};
			this.hasImage =false;
			this.widgetElem = elem;	
		};
	Inline.prototype = {
		'setOptions' :function(opts){
			this.options = opts || {};
		},
		'setSiteKey':function(k){
			this.siteKey = k;		
		},
		'setVSiteKey':function(vk){
			this.vSiteKey = vk;		
		},
		'setData' : function(dataObj){
			this.data = dataObj;
		},
		'_makeLink':function(obj){ 

			var link = document.createElement('a'),
				imageSrc = obj.image.length > 0 ? obj.image : this.options.defaultImage,
				that = this;	
				link.setAttribute('href',obj.url),
				link.innerHTML = this.hasImage ? "<img src='"+imageSrc+"' alt='' border='0'/>" + obj.title : obj.title ;
				upCloo.utils.bind(link,'mousedown',function(){
				var vk = that.vSiteKey !== false ? '|' + that.vSiteKey : '' ;				
				var trackUrl = obj.trackUrl + (that.options.ga === true ? '?ga=' + upCloo.utils.base64.encode( 'inline|' + that.options.theme + vk ) : '') ;
					this.setAttribute('href',trackUrl );
					
				});
				
			return link;
		},
		'setHasImage':function(yesno){
			this.hasImage = yesno;
		},
		'render' : function(){
			var arr = this.data,
				tmpHeadline = document.createElement('li'),	
				tmpUl = document.createElement('ul'),
				count = 'limit' in this.options ? parseInt(this.options.limit,10) : 3 ;
				
			upCloo.utils.addClass(this.widgetElem,'upcloo-inline');
			upCloo.utils.addClass(this.widgetElem,'upcloo-widget');
			//has thumb 
			if(this.hasImage)upCloo.utils.addClass(this.widgetElem,'upcloo-img');
			if(this.options.headline ){
				tmpHeadline.innerHTML = this.options.headline;
				upCloo.utils.addClass(tmpHeadline,'upcloo-inline-title');
				tmpUl.appendChild(tmpHeadline);
			}
			for(var i=0; i < count; i++){
				if(arr[i] === undefined)break;
				var tmpLi = document.createElement('li');
					tmpLi.appendChild(this._makeLink(arr[i]));
					tmpUl.appendChild(tmpLi);
			}
			this.widgetElem.appendChild(tmpUl);
			if(this.options.ga === true && '_gaq' in global && typeof global._gaq.push == 'function'){
				global._gaq.push(['_trackEvent', 'UpCloo-'+this.siteKey+(this.vSiteKey !== false ? '-'+this.vSiteKey : ''), 'show', 'inline-'+this.options.theme]);
			}
		}
	};

	if('upCloo' in global){
		'widgets' in global.upCloo ? false : global.upCloo.widgets = {};
		global.upCloo.widgets.inline = function(elem){ return new Inline(elem); }
	}
})(window === undefined ? this : window);
