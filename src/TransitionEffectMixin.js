import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

/**
 * Update state before, during, and after CSS transitions
 *
 * @module TransitionEffectMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function TransitionEffectMixin(Base) {
  // The class prototype added by the mixin.
  class TransitionEffect extends Base {
    [internal.componentDidMount]() {
      if (super[internal.componentDidMount]) {
        super[internal.componentDidMount]();
      }
      const elementsWithTransitions = this[internal.elementsWithTransitions];
      // We assume all transitions complete at the same time. We only listen to
      // transitioneend on the first element.
      elementsWithTransitions[0].addEventListener('transitionend', event => {
        // If an effectEndTarget has been defined, wait for the transitioneend
        // event to be raised with that target.
        const { effectEndTarget } = this[internal.state];
        if (!effectEndTarget || effectEndTarget === event.target) {
          // Advance to the next phase.
          this[internal.setState]({
            effectPhase: 'after'
          });
        }
      });
    }

    [internal.componentDidUpdate](/** @type {PlainObject} */ changed) {
      if (super[internal.componentDidUpdate]) {
        super[internal.componentDidUpdate](changed);
      }
      if (changed.effect || changed.effectPhase) {
        const { effect, effectPhase } = this[internal.state];
        /**
         * Raised when [state.effect](TransitionEffectMixin#effect-phases) or
         * [state.effectPhase](TransitionEffectMixin#effect-phases) changes.
         *
         * Note: In general, Elix components do not raise events in response to
         * outside manipulation. (See
         * [internal.raiseChangeEvents](symbols#raiseChangeEvents).) However, for
         * a component using `TransitionEffectMixin`, a single invocation of the
         * `startEffect` method will cause the element to pass through multiple
         * visual states. This makes it hard for external hosts of this
         * component to know what visual state the component is in. Accordingly,
         * the mixin raises the `effect-phase-changed` event whenever the effect
         * or phase changes, even if `internal.raiseChangeEvents` is false.
         *
         * @event effect-phase-changed
         */
        const event = new CustomEvent('effect-phase-changed', {
          detail: {
            effect,
            effectPhase
          }
        });
        this.dispatchEvent(event);

        if (effect) {
          if (effectPhase !== 'after') {
            // We read a layout property to force the browser to render the component
            // with its current styles before we move to the next state. This ensures
            // animated values will actually be applied before we move to the next
            // state.
            this.offsetHeight;
          }

          if (effectPhase === 'before') {
            // Advance to the next phase.
            this[internal.setState]({
              effectPhase: 'during'
            });
          }
        }
      }
    }

    /**
     * Return the elements that use CSS transitions to provide visual effects.
     *
     * By default, this assumes the host element itself will have a CSS
     * transition applied to it, and so returns an array containing the element.
     * If you will be applying CSS transitions to other elements, override this
     * property and return an array containing the implicated elements.
     *
     * See [internal.elementsWithTransitions](symbols#elementsWithTransitions)
     * for details.
     *
     * @type {HTMLElement[]}
     */
    get [internal.elementsWithTransitions]() {
      const base = super[internal.elementsWithTransitions];
      return base || [this];
    }

    /**
     * See [internal.startEffect](symbols#startEffect).
     *
     * @param {string} effect
     */
    async [internal.startEffect](effect) {
      await this[internal.setState]({
        effect,
        effectPhase: 'before'
      });
    }
  }

  return TransitionEffect;
}
