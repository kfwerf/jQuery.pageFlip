/*! jQuery Page Flip Plug and Play - v1 - 15/06/2013
* Kenneth van der Werf | DuskyDesigns.nl
* Copyright (c) 2013 Kenneth van der Werf; Licensed MIT, GPL */
;(function($){
    'use strict';

    $.fn.pageFlip = function(to, options) {
        //-> Example call, $('.about-myself').pageFlip('.expandedinfo', {direction: 'up', pages: '.row-wrapper', manualframe: 50, startfrom: 50});
        // Needs a default active class to determine visible
        if((this).hasClass('flip-container')) { return; }

        //-> Default vars
        var oOptions        = options || {},
        sFlipDirection      = oOptions.direction || 'up',
        sFlipAxis           = (sFlipDirection === 'up' || sFlipDirection === 'down') ? 'y' : 'x', //-> Which side does it need to flip to
        eThis               = $(this),
        ePages              = $(this).find('> ' + oOptions.pages) || $(this).find('> .page') || $(this).find('> *'), //-> Default pages are .page
        sActive             = oOptions.activeclass || '.active', //-> Class which displays current active page
        eCurrent            = $(this).find('> ' + sActive),
        eTo                 = eThis.find(to),
        nDuration           = 1,
        fOnComplete         = oOptions.onComplete || null,
        bUseFallback        = false, //oOptions.usefallback || ($('html').hasClass('csstransforms3d')) ? false : true,
        bDestroy            = (typeof oOptions.destroy === 'boolean') ? oOptions.destroy : true, //-> Default we destroy the enviroment at completion
        bAutostart          = (typeof oOptions.autostart === 'boolean') ? oOptions.autostart : true,
        nManualFrame        = oOptions.manualframe || 0,
        startFrom           = oOptions.startfrom || 0,
        nWidth              = oOptions.width || null,
        nHeight             = oOptions.height || null,
        
        eBackplateBefore,       //-> Populated on splitElement
        eBackplateAfter,        //-> Populated on splitElement
        eBefore,                //-> Populated on splitElement
        eAfter,                 //-> Populated on splitElement
        
        destroyEnviroment,      //-> Populated later on flow
        buildEnviroment,        //-> Populated later on flow
        doInit,                 //-> Populated later on flow
        seekFrame,              //-> Populated later on flow
        doStateChange,          //-> Populated later on flow
        doFlipAnimation,        //-> Populated later on flow
        doFallbackAnimation,    //-> Populated later on flow
        
        publicApi,              //-> Populated later on flow / Public API
        
        oTimeline           = new TimelineMax({ onComplete: function() {
            if(bDestroy) {
                destroyEnviroment();
            }
            if(fOnComplete) {
                fOnComplete();
            }
        }});

        //-> Builder for the enviroment that allows the flip
        buildEnviroment = function(options) {
            var oOptions = options || {},
                sAxis = oOptions.axis || 'y';
           
            //-> Here we build the env
            eThis.addClass('flip-container flip-' + sAxis);
            
            //-> Set everything to visible before cloning
            ePages.show();

            //-> Backplate Before
            eBackplateBefore = eCurrent.splitElement({prefix: 'flip-', axis: sAxis, containerclass: '.flip-backplate-before', destroy: false, width: nWidth, height: nHeight }); //-> Keep original, events
            //-> Backplate After
            eBackplateAfter = eTo.splitElement({prefix: 'flip-', axis: sAxis, containerclass: '.flip-backplate-after', destroy: false, width: nWidth, height: nHeight }); //-> Keep original, events
            //-> Before
            eBefore = eCurrent.splitElement({prefix: 'flip-', axis: sAxis, containerclass: '.flip-before', destroy: false, width: nWidth, height: nHeight }); //-> Keep original, events
            //-> After
            eAfter  = eTo.splitElement({prefix: 'flip-', axis: sAxis, containerclass: '.flip-after', destroy: false, width: nWidth, height: nHeight }); //-> Keep original, events

            //
            ePages.hide();
            eTo.show();
            eCurrent.removeClass('active');
            eTo.addClass('active');
            
            ePages.removeClass(sActive.slice(1, sActive.length));
            
            eTo.addClass(sActive.slice(1, sActive.length));
        }

        //-> Destroyer of enviroments. It's a baaddd man. Declared earlier.
        destroyEnviroment = function() {
            if(eBefore && eAfter) {
                
                eBefore.unbind().remove();
                eAfter.unbind().remove();
                
                eBackplateBefore.unbind().remove();
                eBackplateAfter.unbind().remove();
            }
            
            eThis.removeClass('flip-x flip-y flip-container');
        }

        //-> State manipulations in between events. Makes the switch at 50% or halfway.
        doStateChange = function(state) {
            //-> All the elements available
            var eBeforeOne      = eBefore.find('.flip-split-0'),
                eBeforeTwo      = eBefore.find('.flip-split-1'),
                eAfterOne       = eAfter.find('.flip-split-0'),
                eAfterTwo       = eAfter.find('.flip-split-1'),
                eBackplateAfterOne      = eBackplateAfter.find('.flip-split-0'),
                eBackplateAfterTwo      = eBackplateAfter.find('.flip-split-1'),
                eBackplateBeforeOne     = eBackplateBefore.find('.flip-split-0'),
                eBackplateBeforeTwo     = eBackplateBefore.find('.flip-split-1');

                $(eBefore, eAfter, eBackplateAfter, eBackplateBefore, eBeforeOne, eBeforeTwo, eAfterOne, eAfterTwo, eBackplateAfterOne, eBackplateAfterTwo, eBackplateBeforeOne, eBackplateBeforeTwo).removeClass('no-opacity');

            if(state === 'after') {
                eAfter.removeClass('no-opacity');
                eBefore.addClass('no-opacity');

                switch(sFlipDirection) {
                    case 'left' :
                        eAfterOne.addClass('no-opacity');
                        eBackplateAfterTwo.addClass('no-opacity');
                    break;
                    case 'up' :
                      // eAfterTwo.addClass('no-opacity');
                    break;
                    case 'right' :
                        eAfterTwo.addClass('no-opacity');
                        eBackplateAfterOne.addClass('no-opacity');
                        //eBackplateOne.addClass('no-opacity');
                        //eBeforeOne.removeClass('no-opacity');
                       // eBackplateTwo.addClass('no-opacity');
                    break;
                    case 'down' :
                       // eBeforeTwo.addClass('no-opacity');
                       // eBeforeOne.removeClass('no-opacity');
                        //eBackplateOne.addClass('no-opacity');

                    break;
                }

            } else {
                eAfter.addClass('no-opacity');

                switch(sFlipDirection) {
                    case 'left' :
                        
                    break;
                    case 'up' :
                        eBeforeOne.addClass('no-opacity');
                        eBackplateAfterOne.addClass('no-opacity');
                    break;
                    case 'right' :
                        console.log('qualified')
                        eBeforeOne.addClass('no-opacity');
                        eBackplateAfterOne.addClass('no-opacity');
                    break;
                    case 'down' :
                        eAfterOne.addClass('no-opacity');
                        eBackplateAfterTwo.addClass('no-opacity');

                    break;
                }
                
            }
        }

        //-> Manipulation of the enviroment in order to perform a page flip
        doFlipAnimation = function(options) {
            var oOptions = options || {},
                oBeforeOptions = {
                    ease: Quad.easeIn,
                    onComplete: function() {
                        doStateChange('after');
                    }
                },
                oAfterOptions = {
                    ease: Quad.easeOut, 
                    onReverseComplete: function() { 
                        doStateChange('before');
                    }
                },
                sDirection = options.direction || 'left',
                nRotation = 'rotationY',
                nBeforeSplitNumber = 0,
                nAfterSplitNumber = 1;

                doStateChange('before');

                switch(sDirection) {
                    case 'up' :
                        nRotation = 'rotationX';
                        nBeforeSplitNumber = 1,
                        nAfterSplitNumber = 0;
                        oBeforeOptions[nRotation] = 90;
                        oAfterOptions[nRotation] = -90;
                    break;
                    case 'down' :
                        nRotation = 'rotationX';
                        oBeforeOptions[nRotation] = -90;
                        oAfterOptions[nRotation] = 90;
                    break;
                    case 'left' :
                        oBeforeOptions[nRotation] = 90;
                        oAfterOptions[nRotation] = -90;
                    break;
                    case 'right' :
                        nBeforeSplitNumber = 1;
                        nAfterSplitNumber = 0;
                        oBeforeOptions[nRotation] = -90;
                        oAfterOptions[nRotation] = 90;
                    break;
                }

                oTimeline.append(
                    TweenLite.to(eBefore.find('.flip-split-' + nBeforeSplitNumber), nDuration * .6, oBeforeOptions)
                );
                oTimeline.append(
                    TweenLite.from(eAfter.find('.flip-split-' + nAfterSplitNumber), nDuration * .4, oAfterOptions) // After goes from bottom
                );  
        }
        
        //-> Fallback for no browser support, needs modernizr to detect, TODO
        doFallbackAnimation = function(options) {

        }

        //-> Seek frame and accordingly change the state
        seekFrame = function(frame) {
            if(frame > 100 || frame < 0) {
                console.log('seekFrame should have a percentage value of 0 - 100');
                oTimeline.pause();
                return; // Exit
            }
            var nFrame = 0;
            if(frame < 59) {
                doStateChange('before');
            }
            if(frame > 59) {
                // This is to fix the onComplete however it needs more conditionals so it knows direction
                doStateChange('after');
            }
            nFrame = (frame / 100) * nDuration
            oTimeline.seek(nFrame);
            oTimeline.pause();
        }
        
        //-> Init and detect
        doInit = function() {
            oTimeline.pause();
            
            buildEnviroment({axis: sFlipAxis});
        
            //-> Delegate to the right animate function
            if(bUseFallback) {
                // doFallbackAnimation({direction: sFlipDirection});
            } else {
                doFlipAnimation({direction: sFlipDirection});
            }
        }

        doInit();

        if(bAutostart) {
            oTimeline.play();
        }
        

        publicApi = function(options) {
            var oCommands = options || {},
                sCommand = oCommands.do || 'start',
                nFrame = oCommands.frame || 0,
                sDirection = oCommands.direction || sFlipDirection;


            if(!eThis.hasClass('flip-container')) { 
                doInit();
            }

            switch(sCommand) {
                case 'start':
                    oTimeline.play();
                break;
                case 'reverse':
                     oTimeline.reverse();
                break;
                case 'pause':
                     oTimeline.pause();
                break;
                case 'resume':
                    oTimeline.resume();
                break;
                case 'startFrom':
                    seekFrame(nFrame);
                    oTimeline.play();
                break;
                case 'seek':
                    seekFrame(nFrame);
                break;
                case 'delete':
                    destroyEnviroment();
                break;
                case 'direction':
                    destroyEnviroment();

                    sFlipDirection = sDirection;
                    sFlipAxis = (sFlipDirection === 'up' || sFlipDirection === 'down') ? 'y' : 'x';

                    doInit();
                break;
            }
        }

        //-> For greater control allow it to be pasted onto a variable with more precise control
        return {
            start: function() {
               publicApi({do: 'start'});
            },
            reverse: function() {
               publicApi({do: 'reverse'});
            },
            pause: function() {
               publicApi({do: 'pause'});
            },
            resume: function() {
                publicApi({do: 'resume'});
            },
            startFrom: function(frame) {
                publicApi({do: 'startFrom', with: frame});
            },
            seek: function(frame) {
                publicApi({do: 'seek', with: frame});
            },
            delete: function() {
                publicApi({do: 'delete'});
            },
            changeDirection: function(direction) {
                publicApi({do: 'direction', with: direction})
            }
        }       
    };

})(jQuery);