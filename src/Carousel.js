import { merge } from './updates.js';
import { getSuperProperty } from './workarounds.js';
import * as symbols from './symbols.js';
import AriaListMixin from './AriaListMixin.js';
import ArrowDirectionMixin from './ArrowDirectionMixin.js';
import CenteredStripOpacity from './CenteredStripOpacity.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import Explorer from './Explorer.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import PageDot from './PageDot.js';
import SlidingStage from './SlidingStage.js';
import SwipeDirectionMixin from './SwipeDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';


const Base =
  AriaListMixin(
  ArrowDirectionMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  SwipeDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    Explorer
  ))))))))));


/**
 * Allows a user to navigate a horizontal set of items with touch, mouse,
 * keyboard, or trackpad. This component shows a small dot for each of its
 * items, and displays a sliding effect when moving between items.
 * 
 * @inherits Explorer
 * @mixes AriaListMixin
 * @mixes ArrowDirectionMixin
 * @mixes DirectionSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 * @elementrole {PageDot} proxy
 * @elementrole {CenteredStripOpacity} proxyList
 * @elementrole {SlidingStage} stage
 */
class Carousel extends Base {

  constructor() {
    super();
    this[symbols.roles] = Object.assign({}, this[symbols.roles], {
      proxy: PageDot,
      proxyList: CenteredStripOpacity,
      stage: SlidingStage
    });
  }
  
  get defaultState() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    // As of Mar 14 2018, Firefox does not yet support pointer queries, in which
    // case we assume use of a mouse.
    const pointerQuery = '(pointer: fine)';
    const mediaQueryList = window.matchMedia(pointerQuery);
    const showArrowButtons = mediaQueryList.media === pointerQuery ?
      mediaQueryList.matches :
      true;
    return Object.assign({}, super.defaultState, {
      orientation: 'horizontal',
      proxyListOverlap: true,
      proxyListPosition: 'bottom',
      showArrowButtons
    });
  }

  proxyUpdates(proxy, calcs) {
    const base = super.proxyUpdates(proxy, calcs);
    return merge(base, {
      attributes: {
        'tabindex': ''
      }
    });
  }

  get [symbols.swipeTarget]() {
    return this.$.stage instanceof HTMLElement ?
      this.$.stage :
      super[symbols.swipeTarget];
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, Carousel, symbols.template);
    const stage = result.content.querySelector('#stage');
    this[ArrowDirectionMixin.wrap](stage);
    return result;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        proxyList: {
          attributes: {
            tabindex: ''
          },
          style: {
            outline: 'none'
          }
        },
        stage: {
          attributes: {
            tabindex: ''
          }
        }
      }
    });
  }

}


customElements.define('elix-carousel', Carousel);
export default Carousel;
