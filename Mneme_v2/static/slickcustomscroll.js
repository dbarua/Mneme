/*
* Slick Custom Scrollbar Script
* Created: Oct 3rd, 2011 by PK for DynamicDrive.com. This notice must stay intact for usage 
* Visit http://www.dynamicdrive.com/ for full source code
*/

// March 19th, 12': Update to v1.1, which adds mousewheel support, ability to disable "overscroll" behaviour of scrollbar: http://www.dynamicdrive.com/forums/showthread.php?t=67862

jQuery.fn.customscroll = function( d ) {
    return this.each( function() {
        var direction = d.direction, bounce = typeof d.bounce === 'number'? d.bounce : 20;
        var drag = {
            d: direction,
            t: $( this ).attr( "rel" ),
            id: $( this ),
            setdimensions: function(orientation) { //DD added function
                if (orientation=="horizontal"){
                    drag.b.css( { width: drag.id.width(), left: 0, bottom: 0, position: "absolute", "z-index": 10 } );
                    drag.c.css( { display: "block", position: "absolute", height: drag.id.height() - drag.b.height() - 5, "overflow-y": "hidden" } );
                    drag.s.css( { width: drag.b.width(), top: 0, width: 70, height: drag.b.height(), position: "absolute", "z-index": 100 } );
               	    drag.tickB = parseFloat( parseInt( drag.c.width() - drag.s.parent().width() ) / parseInt( drag.s.parent().width() - drag.s.width() ) );
                    drag.tickC = parseFloat( parseInt( drag.s.parent().width() - drag.s.width() ) / parseInt( drag.c.width() - drag.s.parent().width() ) );
		    return [drag.b.width() - drag.s.width() + bounce, drag.id.width() - drag.c.width() - bounce * drag.tickB];
		} else {
                    drag.b.css( { height: drag.id.height(), right: 0, top: 0, position: "absolute" } );
                    drag.c.css( { display: "block", position: "absolute", width: drag.id.width() - drag.b.width() - 5 } );
                    drag.s.css( { width: drag.b.width(), top: 0, height: 70, position: "absolute" } );
                    drag.tickB = parseFloat( parseInt( drag.c.height() - drag.s.parent().height() ) / parseInt( drag.s.parent().height() - drag.s.height() ) );
                    drag.tickC = parseFloat( parseInt( drag.s.parent().height() - drag.s.height() ) / parseInt( drag.c.height() - drag.s.parent().height() ) );
		    return [drag.b.height() - drag.s.height() + bounce, drag.id.height() - drag.c.height() - bounce * drag.tickB];
		}
	    },	
            create: function() {
                switch ( drag.d ) {
                    case "horizontal":
                        drag.elements( "horizontal" );
                        var maxs=drag.setdimensions( "horizontal" );
                        drag.s.data( { click: false } );
                        drag.s.mouseover( function() {
                            drag.s.data( { click: true } );
                        });
                        drag.s.mouseout( function() {
                            drag.s.data( { click: false } );
                        });
                        drag.id.bind('mousewheel', function( f, delta ) {
                            f.preventDefault();
                            clearTimeout(drag.wheeltimer);
                            var initial = drag.s.position().left, moveby;
                            drag.s.css({left: Math.min(Math.max((moveby = -10 * delta + initial), -bounce), maxs[0])});
                            drag.c.css({left: Math.max(Math.min(- drag.tickB * moveby, drag.tickB * bounce), maxs[1])});
                            drag.wheeltimer = setTimeout(drag.redrawH, 100);
                        });
                        drag.s.mousedown( function( f ) {
                            f.preventDefault();
                            drag.s.data( { hold: false } );
                            var initial = drag.s.parent().offset().left - ( drag.s.offset().left - f.pageX );
                            $( document ).mousemove( function( e ) {
                                e.preventDefault();
                                if ( drag.s.data( "hold" ) == false )
                                {
                                    drag.s.css( { left: Math.min(Math.max(e.pageX - initial, -bounce), maxs[0]) } );
                                    drag.c.css( { left: Math.max(Math.min(- drag.tickB * ( e.pageX - initial ), drag.tickB * bounce),maxs[1]) } );
                                }
                            });
                        });
                        $( document ).mouseup( function() {
                            drag.redrawH();
                        });
                        drag.b.click( function( e ) {
                            if ( drag.s.data( "click" ) == false )
                            {
                                var initial = drag.s.parent().offset().left + ( drag.s.width() / 2 );
                                drag.s.animate( { left: e.pageX - initial } );
                                drag.c.animate( { left: - drag.tickB * ( e.pageX - initial ) }, {
                                    complete: function() {
                                        drag.redrawH();
                                    }
                                });
                            }
                        });
                    break;
                    case "vertical":
                        drag.elements( "vertical" );
                        var maxs=drag.setdimensions( "vertical" );
                        drag.s.data( { click: false } );
                        drag.s.mouseover( function() {
                            drag.s.data( { click: true } );
                        });
                        drag.s.mouseout( function() {
                            drag.s.data( { click: false } );
                        });
			drag.id.bind('mousewheel', function( f, delta ) {
                            f.preventDefault();
                            clearTimeout(drag.wheeltimer);
                            var initial = drag.s.position().top, moveby;
                            drag.s.css({top: Math.min(Math.max((moveby = -10 * delta + initial), -bounce), maxs[0])});
                            drag.c.css({top: Math.max(Math.min(-drag.tickB * moveby, drag.tickB * bounce), maxs[1])});
                            drag.wheeltimer = setTimeout(drag.redrawV, 100);
                        });
                        drag.s.mousedown( function( f ) {
                            f.preventDefault();
                            drag.s.data( { hold: false } );
                            var initial = drag.s.parent().offset().top - ( drag.s.offset().top - f.pageY );
                            $( document ).mousemove( function( e ) {
                                e.preventDefault();
                                if ( drag.s.data( "hold" ) == false )
                                {
                                  drag.s.css( { top: Math.min(Math.max(e.pageY - initial, -bounce), maxs[0]) } );
                                    drag.c.css( { top: Math.max(Math.min(- drag.tickB * ( e.pageY - initial ), drag.tickB * bounce), maxs[1]) } );
                                }
                            });
                        });
                        $( document ).mouseup( function() {
                            drag.redrawV();
                        });
                        drag.b.click( function( e ) {
                            if ( drag.s.data( "click" ) == false )
                            {
                                var initial = drag.s.parent().offset().top + ( drag.s.height() / 2 );
                                drag.s.animate( { top: e.pageY - initial } );
                                drag.c.animate( { top: - drag.tickB * ( e.pageY - initial ) }, {
                                    complete: function() {
                                        drag.redrawV();
                                    }
                                });
                            }
                        });
                    break;
                }
                $( "a" ).click( function() {
                    if ( $( this ).attr( "rel" ) )
                    {
                        drag.move( "#" + $( this ).attr( "rel" ), $( this ).attr( "parent" ) );
                    }
                });

                $( window ).resize( function() { //DD added event
                    drag.setdimensions(drag.d);
										var resetpos=( drag.d=="horizontal" )? {left: 0} : {top: 0}
										drag.c.css( resetpos )
                });

                $( window ).unload( function() {
                    drag.destroy();
                });
            },
            redrawV: function() {
                drag.s.data( { hold: true } );
                if ( drag.s.parent().height() < drag.s.position().top + drag.s.height() )
                {
                    drag.s.animate( { top: drag.s.parent().height() - drag.s.height() }, 250 );
                    drag.c.animate( { top: drag.s.parent().height() - drag.c.height() }, 250 );
                }
                else if ( drag.s.position().top < 0 )
                {
                    drag.s.animate( { top: 0 }, 250 );
                    drag.c.animate( { top: 0 }, 250 );
                }
            },
            redrawH: function() {
                drag.s.data( { hold: true } );
                if ( drag.s.parent().width() < drag.s.position().left + drag.s.width() )
                {
                    drag.s.animate( { left: drag.s.parent().width() - drag.s.width() }, 250 );
                    drag.c.animate( { left: drag.s.parent().width() - drag.c.width() }, 250 );
                }
                else if ( drag.s.position().left < 0 )
                {
                    drag.s.animate( { left: 0 }, 250 );
                    drag.c.animate( { left: 0 }, 250 );
                }
            },
            move: function( where, par ) {
                if ( drag.d == "vertical" && drag.t == par )
                {
                    if ( drag.tickC * $( where ).position().top > drag.s.parent().height() - drag.s.height() )
                    {
                        drag.s.animate( { top: drag.s.parent().height() - drag.s.height() }, { duration: 250 } );
                        drag.c.animate( { top: drag.s.parent().height() - drag.c.height() }, { duration: 250 } );
                    }
                    else
                    {
                        drag.s.animate( { top: drag.tickC * $( where ).position().top }, { duration: 250 } );
                        drag.c.animate( { top: - $( where ).position().top }, { duration: 250 } );
                    }
                }
                else if ( drag.d == "horizontal" && drag.t == par )
                {
                    if ( drag.tickC * $( where ).position().left > drag.s.parent().width() - drag.s.width() )
                    {
                        drag.s.animate( { left: drag.s.parent().width() - drag.s.width() }, { duration: 250 } );
                        drag.c.animate( { left: drag.s.parent().width() - drag.c.width() }, { duration: 250 } );
                    }
                    else
                    {
                        drag.s.animate( { left: drag.tickC * $( where ).position().left }, { duration: 250 } );
                        drag.c.animate( { left: - $( where ).position().left }, { duration: 250 } );
                    }
                }
            },
            elements: function( where ) {
                drag.id.css( { overflow: "hidden", position: "relative" } );
                drag.id.wrapInner( '<div class="' + drag.t + '-content"></div>' );
                drag.c = $( '.' + drag.t + '-content' );
                drag.id.append( '<div class="' + drag.t + '-bar"></div>' );
                drag.b = $( '.' + drag.t + '-bar' );
                drag.b.append( '<div class="' + drag.t + '-drag"></div>' );
                drag.s = $( '.' + drag.t + '-drag' );
            },
            destroy: function() {
                // What happens in DOM, stays in DOM. Unless...
                $( "*" ).each( function() {
                    $( this ).remove();
                });
            }
        };
        drag.create();
    });
};
// And here it ends.
