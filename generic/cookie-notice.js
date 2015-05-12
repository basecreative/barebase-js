/*
Copyright 2012 Silktide Ltd.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>
 */

var cc =
{
	initobj: false,
	setupcomplete: false,
	allasked: false,
	checkedlocal: false,
	checkedremote: false,
	remoteresponse: false,
	frommodal: false,
	sessionkey: false,
	noclosewin: false,
	closingmodal: false,
	jqueryattempts: 0,
	cookies: {},
	approved: {},
	settings: {
		refreshOnConsent: true,
		style: "dark",
		bannerPosition: "top",
		clickAnyLinkToConsent: false,
		privacyPolicy: false,
		collectStatistics: false,
		tagPosition: 'bottom-right',
		useSSL: false,
		serveraddr: 'http://cookieconsent.silktide.com/',
		clearprefs: false
	},

	strings: {
		jqueryWarning: "Developer: Caution! In order to use Cookie Consent, you need to use jQuery 1.4.4 or higher.",
		socialDefaultTitle: "Social media",
		analyticsDefaultTitle: "Analytics",
		advertisingDefaultTitle: "Advertising",
		defaultTitle: "Default cookie title",
		socialDefaultDescription: "Facebook, Twitter and other social websites need to know who you are to work properly.",
		analyticsDefaultDescription: "We anonymously measure your use of this website to improve your experience.",
		advertisingDefaultDescription: "Adverts will be chosen for you automatically based on your past behaviour and interests.",
		defaultDescription: "Default cookie description.",
		notificationTitle: "This website works best when using cookies. By continuing to use this website, you consent to their use.",
		poweredBy: "Powered by Cookie Consent",
		allowForAll: "Allow for all sites",
		allowForSite: "Close",
		privacyPolicy: "Privacy policy",
		learnMore: "Learn more",
		seeDetails: "More Information on why this website uses cookies.",
		hideDetails: "hide details",
		savePreference: 'Save preference',
		saveForAllSites: 'Save for all sites',
		allowCookies: 'Allow cookies',
		allowForAllSites: 'Allow for all sites',
		customCookie: 'This website uses a custom type of cookie which needs specific approval',
		privacySettings: "Privacy settings",
		privacySettingsDialogTitleA: "Privacy settings",
		privacySettingsDialogTitleB: "for this website",
		privacySettingsDialogSubtitle: "Some features of this website need your consent to remember who you are.",
		closeWindow: "Close window",
		changeForAllSitesLink: "Change settings for all websites",
		preferenceUseGlobal: 'Use global setting',
		preferenceConsent: "I consent",
		preferenceDecline: "I decline",
		notUsingCookies: "This website does not use any cookies.",
		clearedCookies: "Your cookies have been cleared, you will need to reload this page for the settings to have effect.",
		allSitesSettingsDialogTitleA: "Privacy settings",
		allSitesSettingsDialogTitleB: "for all websites",
		allSitesSettingsDialogSubtitle: "You may consent to these cookies for all websites that use this plugin.",
		backToSiteSettings: "Back to website settings"
	},

	onconsent: function(cookieType, input)
	{
		if(cc.isfunction(input))
		{
			fn = input;
		}
		else
		{
			scriptname = input;
			fn = function()
			{
				cc.insertscript(scriptname);
			};
		}
		if(cc.cookies[cookieType].approved)
		{
			cc.cookies[cookieType].executed = true;
			fn();
		} else {
			jQuery(document).bind("cc_"+cookieType, fn);
		}
	},

	isfunction: function(functionToCheck) {
	 var getType = {};
	 return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
	},

	setup: function()
	{
			var verstr = jQuery().jquery.replace(/\./g, '');
			while (verstr.length < 6) {
				verstr = verstr + '0';
			}
			jQuery.each(cc.initobj.cookies, function(key, value) {
			if(!value.title)
			{
				if(key == "social")
				{
					cc.initobj.cookies[key].title = cc.strings.socialDefaultTitle;
				}
				else if(key == "analytics")
				{
					cc.initobj.cookies[key].title = cc.strings.analyticsDefaultTitle;
				}
				else if(key == "advertising")
				{
					cc.initobj.cookies[key].title = cc.strings.advertisingDefaultTitle;
				} else {
					cc.initobj.cookies[key].title = cc.strings.defaultTitle;
				}
			}
			if(!value.description)
			{
				if(key == "social")
				{
					cc.initobj.cookies[key].description = cc.strings.socialDefaultDescription;
				}
				else if(key == "analytics")
				{
					cc.initobj.cookies[key].description = cc.strings.analyticsDefaultDescription;
				}
				else if(key == "advertising")
				{
					cc.initobj.cookies[key].description = cc.strings.advertisingDefaultDescription;
				} else {
					cc.initobj.cookies[key].description = cc.strings.defaultDescription;
				}
			}
			cc.initobj.cookies[key].asked = false;
			cc.initobj.cookies[key].approved = false;
			cc.initobj.cookies[key].executed = false;
		});





		for (var attrname in cc.initobj.cookies)
		{
			cc.cookies[attrname] = cc.initobj.cookies[attrname];
		}
	},

	initialise: function (obj)
	{
		cc.initobj = obj;
		if(obj.settings !== undefined)
		{
			for (var attrname in obj.settings) { this.settings[attrname] = obj.settings[attrname]; }
		}
		if(obj.strings !== undefined)
		{
			for (var attrname in obj.strings) { this.strings[attrname] = obj.strings[attrname]; }
		}
		cc.settings.style = "cc-"+cc.settings.style;
		cc.settings.bannerPosition = "cc-"+cc.settings.bannerPosition;
		if(cc.settings.useSSL)
		{
			cc.settings.serveraddr = 'https://cookieconsent.silktide.com/';
		}
		if(window.jQuery)
		{
			cc.setupcomplete = true;

			cc.setup();
		}
	},

	calculatestatsparams: function()
	{
		params = "c=";
		first = true;
		jQuery.each(cc.initobj.cookies, function(key, value) {
			if(first)
			{
				first = false;
			} else
			{
				params += ";";
			}
			params += encodeURIComponent(key)+":";

			if(cc.approved[key])
			{
				params += cc.approved[key];
			} else {
				params += "none";
			}
			if(value.statsid)
			{
				params += ":" + value.statsid;
			}
		});
		
		params += "&m=0";
		params += "&u=" + encodeURIComponent(document.URL);
		return params;
	},

	setsessionkey: function(data)
	{
		cc.sessionkey = data;
	},


	fetchprefs: function()
	{
		cc.remoteresponse = false;
		params = "?s=1";
		if(cc.settings.collectStatistics)
		{
			params = "?s=1&" + cc.calculatestatsparams();
		}
		if(cc.settings.clearprefs)
		{
			params += "&v=1";
			cc.settings.clearprefs = false;
		}
		cc.insertscript(cc.settings.serveraddr+params);
		setTimeout(function(){
			if(!cc.remoteresponse)
			{
				cc.checkapproval();
			}
		}, 3000);
		this.checkedremote = true;
	},

	responseids: function(data)
	{
		jQuery.each(data, function(key, value) {
			cc.cookies[key].statsid = value;
		});
	},

	insertscript: function(script)
	{
		var newfile = document.createElement('script');
		newfile.setAttribute("type","text/javascript");
		newfile.setAttribute("src", script);
		document.getElementsByTagName("head")[0].appendChild(newfile);
	},

	insertscripttag: function(content)
	{
		var newfile = document.createElement('script');
		newfile.setAttribute("type","text/javascript");
		newfile.innerHTML = content;
		document.getElementsByTagName("head")[0].appendChild(newfile);
	},

	checklocal: function()
	{
		this.checkedlocal = true;
		jQuery.each(cc.cookies, function(key, value)
		{
			cookieval = cc.getcookie('cc_'+key);
			if(cookieval)
			{
				cc.approved[key] = cookieval;
			}
		});
		this.checkapproval();
	},

	response: function (data)
	{
		cc.remoteresponse = true
		jQuery.each(data, function(key, value) {
			if(cc.cookies[key] && (!cc.approved[key] || (cc.approved[key] && (cc.approved[key] == "always" || cc.approved[key] == "never"))))
			{
				cc.setcookie('cc_'+key, value, 365);
			}
		});

		for (var attrname in data)
		{
			if(this.approved[attrname] != "yes" && this.approved[attrname] != "no")
			{
				this.approved[attrname] = data[attrname];
			}
		}
		jQuery.each(cc.cookies, function(key, value) {
			if(!data[key] && (cc.approved[key] == "always" || cc.approved[key] == "never"))
			{
				cc.cookies[key].approved = false;
				cc.deletecookie(key);
				delete cc.approved[key];
			}
		});

		this.checkapproval();
	},

	deletecookie: function(key)
	{
		date = new Date();
		date.setDate(date.getDate() -1);
		document.cookie = escape("cc_"+key) + '=; path=/; expires=' + date;
	},

	reloadifnecessary: function()
	{
		if(cc.settings.refreshOnConsent)
		{
			setTimeout("location.reload(true);",50);
		}
	},

	onkeyup: function(e)
	{
		if (e.keyCode == 27)
		{
			cc.closemodals();
		}
	},

	closemodals: function()
	{
		if(!cc.closingmodal)
		{
			if(cc.noclosewin)
			{
				cc.noclosewin = false;
			} else {
				if(jQuery('#cc-modal').is(":visible"))
				{
					jQuery('#cc-modal .cc-modal-closebutton a').click();
				}
				if(jQuery('#cc-settingsmodal').is(":visible"))
				{
					jQuery('#cc-settingsmodal #cc-settingsmodal-closebutton a').click();
				}
			}
		}
	},

	showbanner: function ()
	{
		jQuery('#cc-tag').fadeOut(null, function() {
			jQuery(this).remove();
		});
		jQuery('#cc-notification').remove();
		data = '<div id="cc-notification">' +
				'<div id="cc-notification-wrapper">' +
				'<h2><span>'+cc.strings.notificationTitle+'</span></h2>' +
				'<div id="cc-notification-permissions">' +
				//'<p id="cc-notification-moreinformation"><a href="http://silktide.com/cookielaw" target="_blank">More information about cookies</a></p>' +
				'<a id="cc-notification-logo" class="cc-logo" target="_blank" href="http://silktide.com/cookieconsent" title="'+cc.strings.poweredBy+'"><span>'+cc.strings.poweredBy+'</span></a> ' +
				'</div>' +
				'<ul class="cc-notification-buttons">' +

				'<li>' +
				'<a href="#" id="cc-approve-button-allsites">'+cc.strings.allowForAll+'</a>' +
				'</li>' +
				'<li>' +
				'<a  href="#" id="cc-approve-button-thissite">'+cc.strings.allowForSite+'</a>' +
				'</li>' +
				'</ul>' +
				'<div class="cc-clear"></div>' +
				'</div>' +
				'</div>';
			jQuery('body').prepend(data);
			jQuery('#cc-notification-logo').hide();
			if(cc.settings.privacyPolicy)
			{
				jQuery('#cc-notification-moreinformation').prepend('<a href="'+cc.settings.privacyPolicy+'">'+cc.strings.privacyPolicy+'</a> | ');
			}
			jQuery('#cc-notification').addClass(cc.settings.style).addClass(cc.settings.bannerPosition);
			jQuery('#cc-notification-permissions').prepend('<ul></ul>');
			allcustom = true;
			jQuery.each(cc.cookies, function(key, value) {
				if(!value.asked)
				{
					jQuery('#cc-notification-permissions ul').append('<li><input type="checkbox" checked="checked" id="cc-checkbox-'+key+'" /> <label id="cc-label-'+key+'" for="cc-checkbox-'+key+'"><strong>'+value.title+'</strong> '+value.description+'</label></li>');
					if(value.link)
					{
						jQuery('#cc-label-'+key).append(' <a target="_blank" href="'+value.link+'" class="cc-learnmore-link">'+cc.strings.learnMore+'</a>');
					}
					if(key == "social" || key == "analytics" || key == "advertising")
					{
						allcustom = false;
					}
// 					else {
//						//jQuery('#cc-notification-permissions ul #cc-checkbox-'+key).siblings('label').append(' [This is a cookie custom to this website and requires consent]');
//					}


				}
			});
			jQuery('#cc-notification-wrapper h2').append(' - <a class="cc-link" href="/cookies" id="cc-notification-moreinfo">'+cc.strings.seeDetails+'</a>');
			jQuery('#cc-notification-moreinfo2').click(function(){

				if(jQuery(this).html() == cc.strings.seeDetails)
				{
					jQuery('#cc-approve-button-thissite').html(cc.strings.savePreference);
					jQuery('#cc-approve-button-allsites').html(cc.strings.saveForAllSites);
					jQuery(this).html(cc.strings.hideDetails);
				} else {
					jQuery.each(cc.cookies, function(key, value) {
						jQuery('#cc-checkbox-'+key).attr('checked', 'checked');
					});
					jQuery('#cc-approve-button-thissite').html(cc.strings.allowCookies);
					jQuery('#cc-approve-button-allsites').html(cc.strings.allowForAllSites);
					jQuery(this).html(cc.strings.seeDetails);
				}
				jQuery('#cc-notification-logo').fadeToggle();
				jQuery('#cc-notification-permissions').slideToggle();
				jQuery(this).blur();
				return false;
			});

			
				jQuery('#cc-notification').show();
			

			jQuery('#cc-approve-button-thissite').click(cc.onlocalconsentgiven);
			if(cc.settings.clickAnyLinkToConsent)
			{
				jQuery("a").filter(':not(.cc-link)').click(cc.onlocalconsentgiven);
			}
			if(allcustom)
			{
				jQuery('#cc-notification h2 span').html(cc.strings.customCookie);
				jQuery('#cc-approve-button-allsites').hide();
			} else {
				jQuery('#cc-approve-button-allsites').click(cc.onremoteconsentgiven);
			}

	},

	timestamp: function()
	{
		return Math.round((new Date()).getTime() / 1000);
	},

	checkapproval: function()
	{
		cc.allasked = true;
		jQuery.each(cc.cookies, function(key, value) {
			if(cc.approved[key])
			{
				if(cc.approved[key] == "yes" || (cc.approved[key] == "always" && cc.checkedremote))
				{
					cc.cookies[key].asked = true;
					cc.cookies[key].approved = true;
					cc.execute(key);
				} else if((cc.approved[key] == "never" && cc.checkedremote) || cc.approved[key] == "no")
				{
					cc.cookies[key].asked = true;
					cc.cookies[key].approved = false;
				} else {

					cc.allasked = false;
				}
			} else {

				cc.allasked = false;
			}
		});

		if(!cc.allasked)
		{
			if(!cc.checkedlocal)
			{
				cc.checklocal();
				return;
			}
			if(!cc.checkedremote)
			{
				cc.fetchprefs();
				return;
			}
			cc.showbanner();

            jQuery.each(cc.cookies, function(key, value) {

                cc.approved[key] = "yes";
                cc.cookies[key].asked = true;

                cc.setcookie('cc_'+key, cc.approved[key], 365);
            });
		} else {
			if(cc.settings.collectStatistics)
			{
				params = "";
				params += "?s=1&n=1&" + cc.calculatestatsparams();
				cc.insertscript(cc.settings.serveraddr+params);
			}
			cc.showminiconsent();
		}
	},
        
        revokeconsent: function() {
            jQuery.each(cc.cookies, function(key, value) {

                cc.approved[key] = "no";
                cc.cookies[key].asked = true;

                cc.setcookie('cc_'+key, cc.approved[key], 365);
            });
        },

	execute: function(cookieType)
	{
		if(cc.cookies[cookieType].executed)
		{
			return;
		}
		jQuery('.cc-placeholder-'+cookieType).remove();
		jQuery('script.cc-onconsent-'+cookieType+'[type="text/plain"]').each(function(){
			if(jQuery(this).attr('src'))
			{
				jQuery(this).after('<script type="text/javascript" src="'+jQuery(this).attr('src')+'"></script>');
			} else {
				jQuery(this).after('<script type="text/javascript">'+jQuery(this).html()+'</script>');
			}

		});

		cc.cookies[cookieType].executed = true;
		jQuery(document).trigger("cc_"+cookieType);
	},

	getcookie: function(c_name)
	{
		var i,x,y,ARRcookies=document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++)
		{
		  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		  x=x.replace(/^\s+|\s+$/g,"");
		  if (x==c_name)
		    {
		    	return unescape(y);
		    }
	    }
		return false;
	},

	setcookie: function (name, value, expirydays)
	{
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expirydays);
		document.cookie = name+'='+value+'; expires='+exdate.toUTCString()+'; path=/'
	},

	onremoteconsentgiven: function ()
	{
		enableall = false;
		if(jQuery(this).hasClass('cc-button-enableall'))
		{
			enableall = true;
			jQuery.each(cc.cookies, function(key, value) {
				cc.cookies[key].asked = false;
			});

		}
		if(cc.settings.clickAnyLinkToConsent)
		{
			jQuery("a").filter(':not(.cc-link)').unbind("click");
		}
		jQuery.each(cc.cookies, function(key, value) {
			if(!value.approved && !value.asked)
			{
				if(enableall || jQuery('#cc-checkbox-'+key).is(':checked'))
				{
					if(key == "social" || key == "analytics" || key == "advertising")
					{
						cc.approved[key] = "always";
					} else {
						cc.approved[key] = "yes";
					}
					cc.cookies[key].asked = true;
				} else {
					if(key == "social" || key == "analytics" || key == "advertising")
					{
						cc.approved[key] = "never";
					} else {
						cc.approved[key] = "no";
					}
					cc.cookies[key].asked = true;
				}
				cc.setcookie('cc_'+key, cc.approved[key], 365);
			} else {
			}
		});
		urlx = cc.settings.serveraddr+'?p=1&tokenonly=true&cc-key='+cc.sessionkey;
		if(cc.approved['social'])
		{
			urlx += '&cc-cookies-social='+cc.approved['social'];
		}
		if(cc.approved['analytics'])
		{
			urlx += '&cc-cookies-analytics='+cc.approved['analytics'];
		}
		if(cc.approved['advertising'])
		{
			urlx += '&cc-cookies-advertising='+cc.approved['advertising'];
		}

		cc.insertscript(urlx);

		cc.checkapproval();
		cc.reloadifnecessary();

		return false;
	},

	onlocalconsentgiven: function ()
	{
		enableall = false;
		if(jQuery(this).hasClass('cc-button-enableall'))
		{
			enableall = true;
			jQuery.each(cc.cookies, function(key, value) {
				cc.cookies[key].asked = false;
			});

		}
		if(cc.settings.clickAnyLinkToConsent)
		{
			jQuery("a").filter(':not(.cc-link)').unbind("click");
		}
		jQuery.each(cc.cookies, function(key, value) {
			if(!value.approved && !value.asked)
			{
				if(enableall || jQuery('#cc-checkbox-'+key).is(':checked'))
				{
					cc.approved[key] = "yes";
					cc.cookies[key].asked = true;
				} else {
					cc.approved[key] = "no";
					cc.cookies[key].asked = true;
				}
				cc.setcookie('cc_'+key, cc.approved[key], 365);
			} else {
			}
		});

		
		cc.checkapproval();
		cc.reloadifnecessary();

		return false;
	},

	showminiconsent: function()
	{
		if(jQuery('#cc-tag').length == 0)
		{
			data = '<div id="cc-tag" class="cc-tag-'+cc.settings.tagPosition+'"><a class="cc-link" href="#" id="cc-tag-button" title="'+cc.strings.privacySettings+'"><span>'+cc.strings.privacySettings+'</span></a></div>';
			jQuery('body').prepend(data);
			jQuery('#cc-tag').addClass(cc.settings.style);
			jQuery('#cc-tag').fadeIn();
			jQuery('#cc-tag-button').click(cc.showmodal);

		}
	},

	getsize: function(obj)
	{
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	},

	settoken: function(data)
	{
		cc.sessionkey = data;
	},

	showmodal: function()
	{
		jQuery(document).bind('keyup', cc.onkeyup);
		jQuery('body').prepend('<div id="cc-modal-overlay"></div>');
		jQuery(this).blur();
		
		data = '<div id="cc-modal">' +
				'<div id="cc-modal-wrapper">' +
				'<h2>'+cc.strings.privacySettingsDialogTitleA+' <span>'+cc.strings.privacySettingsDialogTitleB+'</span></h2>' +
				'<p class="cc-subtitle">'+cc.strings.privacySettingsDialogSubtitle+'</p>' +

				'<div class="cc-content">' +
				'</div>' +

				'<div class="cc-clear"></div>' +

				'<p id="cc-modal-closebutton" class="cc-modal-closebutton"><a class="cc-link" href="#" title="'+cc.strings.closeWindow+'"><span>'+cc.strings.closeWindow+'</span></a></p>' +
				'<div id="cc-modal-footer-buttons">' +
			//'<p id="cc-modal-secondclosebutton" class="cc-modal-closebutton"><a class="cc-link" href="#" title="Close window"><span>Close</span></a></p>' +
				'<p id="cc-modal-global"><a class="cc-link" href="#" title="'+cc.strings.changeForAllSitesLink+'"><span>'+cc.strings.changeForAllSitesLink+'</span></a></p></div>' +
			'<a id="cc-notification-logo" class="cc-logo" target="_blank" href="http://silktide.com/cookieconsent" title="'+cc.strings.poweredBy+'"><span>'+cc.strings.poweredBy+'</span></a> ' +
			'<div class="cc-clear"></div>' +
				'</div>' +
				'</div>';
		jQuery('body').prepend(data);
		jQuery('#cc-modal').addClass(cc.settings.style).click(cc.closemodals);
		
		cc.reloadmodal();
		jQuery('#cc-modal').fadeIn();
		jQuery('#cc-modal-overlay').fadeIn();
		jQuery('#cc-modal-wrapper').click(function(){
			cc.noclosewin = true;
		});
		jQuery('#cc-modal .cc-modal-closebutton a').click(function()
		{
			cc.showhidemodal();
			cc.reloadifnecessary();
			return false;
		});
		jQuery('#cc-modal-global').click(function()
		{
			cc.frommodal = true;
			cc.gotosettings();
			return false;
		});
		jQuery('#cc-tag-button').unbind('click').click(cc.showhidemodal);

		return false;
	},

	closepreferencesmodal: function()
	{
		cc.checkedremote = false;
		jQuery.each(cc.cookies, function(key, value) {
			cc.cookies[key].asked = false;
		});
		jQuery('#cc-notification').hide().remove();
		jQuery(this).blur();
		jQuery('#cc-settingsmodal').fadeOut(null, function()
		{
			jQuery('#cc-settingsmodal').remove();
		});
		if(!cc.frommodal)
		{
			cc.checkapproval();
			cc.reloadifnecessary();
		} else {
			cc.frommodal = false;
			cc.showhidemodal();
		}
		return false;
	},

	showhidemodal: function()
	{
		jQuery(this).blur();
		cc.checkedlocal = false;
		cc.checkedremote = false;
		if(jQuery('#cc-modal').is(":visible") && !cc.frommodal)
		{
			cc.closingmodal = true;
			jQuery('#cc-modal-overlay').fadeToggle(null, function(){
				cc.closingmodal = false;
			});
			jQuery.each(cc.cookies, function(key, value) {
				thisval = jQuery('#cc-preference-selector-'+key).val();

				if(thisval == "no")
				{
					cc.cookies[key].approved = false;
					cc.approved[key] = "no";
					cc.setcookie('cc_'+key, cc.approved[key], 365);
				} else if(thisval == "yes") {
					cc.cookies[key].approved = true;
					cc.approved[key] = "yes";
					cc.setcookie('cc_'+key, cc.approved[key], 365);
				} else {
					cc.cookies[key].approved = false;
					cc.deletecookie(key);
					delete cc.approved[key];
				}
				cc.cookies[key].asked = false;

			});
			cc.checkapproval();
		} else if(!jQuery('#cc-settingsmodal').is(":visible") && !jQuery('#cc-modal').is(":visible"))
		{
			cc.closingmodal = true;
			jQuery('#cc-modal-overlay').fadeToggle(null, function(){
				cc.closingmodal = false;
			});
		}
		
			jQuery('#cc-modal').fadeToggle();
		
		return false;
	},


	reloadmodal: function()
	{
		jQuery('#cc-modal-wrapper .cc-content').html('');
		if(cc.getsize(cc.cookies) > 0)
		{
			jQuery('#cc-modal-wrapper .cc-content').append('<ul></ul>');
			jQuery.each(cc.cookies, function(key, value) {

				jQuery('#cc-modal-wrapper ul').append('<li id="cc-preference-element-'+key+'"><label for="cc-preference-selector-'+key+'"><strong>'+value.title+'</strong><span>'+value.description+'</span></label><select id="cc-preference-selector-'+key+'"><option value="yes">'+cc.strings.preferenceConsent+'</option><option value="no">'+cc.strings.preferenceDecline+'</option></select></li>');
				if(value.link)
				{
					jQuery('#cc-preference-element-'+key+' label span').append(' <a target="_blank" href="'+value.link+'" class="cc-learnmore-link">'+cc.strings.learnMore+'</a>');
				}
				if(key == "social" || key == "advertising" || key == "analytics")
				{
					jQuery('#cc-preference-selector-'+key).append('<option value="global">'+cc.strings.preferenceUseGlobal+'</option>');
				}
				jQuery('#cc-change-button-allsites').unbind('click').click(function(){
					cc.frommodal = true;
					cc.gotosettings();
					return false;
				});
				jQuery('#cc-preference-selector-'+key).change(function(){

				});
				if(cc.approved[key] == "yes")
				{
					jQuery('#cc-preference-selector-'+key).val("yes")
				}
				else if(cc.approved[key] == "no")
				{
					jQuery('#cc-preference-selector-'+key).val("no")
				}
				else
				{
					jQuery('#cc-preference-selector-'+key).val("global")
				}

			});
		} else {
			jQuery('#cc-modal-wrapper .cc-content').append('<p>'+cc.strings.notUsingCookies+'</p>');
		}
		jQuery('.cc-content').append('<div class="cc-clear"></div>');
	},

	approvedeny: function() {
		key = jQuery(this).attr("id").split("-")[2];
		if(cc.cookies[key].approved)
		{
			cc.cookies[key].approved = false;
			cc.approved[key] = "no";
		} else {
			cc.cookies[key].approved = true;
			cc.approved[key] = "yes";
		}
		cc.setcookie('cc_'+key, cc.approved[key], 365);
		cc.checkapproval();
		cc.reloadmodal();
		return false;
	},

	clearalllocalcookies: function() {
	    var cookies = document.cookie.split(";");

	    for (var i = 0; i < cookies.length; i++) {
	        var cookie = cookies[i];
	        var eqPos = cookie.indexOf("=");
	        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
	        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	    }
	},

	clearlocal: function()
	{
		cc.clearalllocalcookies();
		jQuery(this).before('<p>'+cc.strings.clearedCookies+'</p>')
	},

	getcurrenturl: function()
	{
		return window.location.protocol + "//" + window.location.host + window.location.pathname;
	},

	gotosettings: function()
	{
		if(jQuery('#cc-modal').is(":visible"))
		{
			cc.showhidemodal();
		}
		jQuery(this).blur();
		if(cc.frommodal)
		{
			buttontext = cc.strings.backToSiteSettings;
		} else {
			buttontext = cc.strings.closeWindow;
		}

		data = '<div id="cc-settingsmodal">' +
				'<div id="cc-settingsmodal-wrapper">' +
				'<h2>'+cc.strings.allSitesSettingsDialogTitleA+' <span>'+cc.strings.allSitesSettingsDialogTitleB+'</span></h2>' +
			'<p class="cc-subtitle">'+cc.strings.allSitesSettingsDialogSubtitle+'</p>' +
				'<div class="cc-content">' +
				'<iframe src="'+cc.settings.serveraddr +'?t='+cc.settings.style+'" />' +
				'</div>' +
				'<div class="cc-clear"></div>' +
				'<p id="cc-settingsmodal-closebutton" class="cc-settingsmodal-closebutton"><a class="cc-link" href="#" title="'+buttontext+'"><span>'+buttontext+'</span></a></p>' +
			'<div id="cc-settingsmodal-footer-buttons">' +
				'<p id="cc-settingsmodal-secondclosebutton" class="cc-settingsmodal-closebutton"><a class="cc-link" href="#" title="'+buttontext+'"><span>'+buttontext+'</span></a></p>' +
			'</div>' +
				'<a id="cc-notification-logo" class="cc-logo" target="_blank" href="http://silktide.com/cookieconsent" title="'+cc.strings.poweredBy+'"><span>'+cc.strings.poweredBy+'</span></a> ' +
				'</div>' +
				'</div>';
		jQuery('body').prepend(data);
		jQuery('#cc-settingsmodal').addClass(cc.settings.style).click(cc.closemodals);
		jQuery('#cc-settingsmodal-wrapper').click(function(){
			cc.noclosewin = true;
		});
		jQuery('#cc-settingsmodal').fadeIn();
		jQuery('.cc-settingsmodal-closebutton').click(cc.closepreferencesmodal);

		return false;
	},

	

	onfirstload: function()
	{
		if(!cc.setupcomplete && cc.initobj)
		{
			if(!(window.jQuery))
			{
				cc.jqueryattempts++;
				if(cc.jqueryattempts >= 5)
				{
					return;
				}
				setTimeout(cc.onfirstload, 200);
				return;
			}
			cc.setupcomplete = true;
			cc.setup();
		}
		jQuery('.cc-button-enableall').addClass('cc-link').click(cc.onlocalconsentgiven);
                jQuery('#revoke-consent').click(cc.revokeconsent);
		cc.checkapproval();
	}
}

if(!(window.jQuery)) {
	var s = document.createElement('script');
	s.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js');
	s.setAttribute('type', 'text/javascript');
	document.getElementsByTagName('head')[0].appendChild(s);
	window.onload = cc.onfirstload;
} else {
	jQuery(document).ready(cc.onfirstload);
}



