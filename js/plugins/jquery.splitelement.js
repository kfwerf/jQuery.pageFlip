/*! jQuery Split Element Plug and Play - v1 - 15/06/2013
* Kenneth van der Werf | DuskyDesigns.nl
* Copyright (c) 2013 Kenneth van der Werf; Licensed MIT, GPL */
;(function($){
    'use strict';

    $.fn.splitElement = function(options) {
        //-> Required and optional vars
        var oOptions = options || {},
            iSplitAmount = oOptions.splitamount || 2, //-> Currently cannot handle more than 2 splits, TODO
            sAxis = oOptions.axis || 'y',
            sPrefix = oOptions.prefix || '',
            eTarget = $(this),
            sContainer = oOptions.containerclass || 'rebuild-element',
            eContainer,
            nWidth = oOptions.width,
            nHeight = oOptions.height,
            isClearedToDestroy = oOptions.destroy,
            //-> Precalculated dimensions
            nTargetHeight = nHeight || eTarget.height(),
            nTargetWidth = nWidth || eTarget.width(),
            nSplittedHeight = nTargetHeight / iSplitAmount,
            nSplittedWidth = nTargetWidth / iSplitAmount,
            //-> Split loop
            i = 0,
            sTemplate = '',
            nMaskAmountX,
            nMaskAmountY,
            nMaskWidth,
            nMaskHeight;
        //-> The Loop
        for(i = 0; i < (iSplitAmount); i++) { //-> -1 because else it calculates 0
            //-> Calculate mask positioning
            nMaskAmountX = (sAxis === 'x') ? -nSplittedWidth * i : 0;
            nMaskAmountY = (sAxis === 'y') ? -nSplittedHeight * i : 0;
            nMaskWidth = (sAxis === 'x') ? nSplittedWidth : nTargetWidth;
            nMaskHeight = (sAxis === 'y') ? nSplittedHeight : nTargetHeight;
            //-> Add mask to the template, TODO: clone().wrap instead?
            sTemplate = sTemplate + '<div class="' + sPrefix + 'split ' + sPrefix + 'split-' + i + '"  style="height:' + nMaskHeight + 'px;width:' + nMaskWidth + 'px; position: absolute; top: ' + (nMaskAmountY*-1) + 'px; left: ' + (nMaskAmountX*-1) + 'px; overflow: hidden;"><div class="' + sPrefix + 'mask" style="width: ' + nTargetWidth + 'px; height: ' + nTargetHeight + 'px;top:' + nMaskAmountY + 'px;left:' + nMaskAmountX + 'px;position: relative;"></div></div>';

            //sTemplate = sTemplate + '<div class="' + sPrefix + 'split ' + sPrefix + 'split-' + i + '"  style="height:' + nMaskHeigh + 'px;width:' + nMaskWidth + 'px; position: absolute; top: ' + (nMaskAmountY*-1) + 'px; left: ' + (nMaskAmountX*-1) + 'px;"><div class="' + sPrefix + 'mask" style="width: ' + nTargetWidth + 'px; height: ' + nTargetHeight + 'px;-webkit-transform: translateY(' + nMaskAmountY + 'px) translateX(' + nMaskAmountX + 'px) translateZ(0.3px);-moz-transform: translateY(' + nMaskAmountY + 'px);translateX(' + nMaskAmountX + 'px); translateZ(0.3px);-o-transform: translateY(' + nMaskAmountY + 'px);translateX(' + nMaskAmountX + 'px); translateZ(0.3px);transform: translateY(' + nMaskAmountY + 'px) translateX(' + nMaskAmountX + 'px) translateZ(0.3px)"></div></div>';
        }

        //-> Create everything out of the prework
        eTarget.parent().append('<div class="' + sContainer.slice(1, sContainer.length) + '"></div>'); //-> Remove dot at the start
        eContainer = eTarget.parent().find(sContainer);
        eContainer.height(nTargetHeight).width(nTargetWidth).append(sTemplate);
        eTarget.clone().height(nTargetHeight).width(nTargetWidth).css('display', 'block').appendTo(eContainer.find('.' + sPrefix + 'mask'));

        //-> Destroy element outside of the scope
        if(isClearedToDestroy) {
            eTarget.first().remove(); //-> 0 is original
        }

        return eContainer; //-> Return to sender
    }

})(jQuery);