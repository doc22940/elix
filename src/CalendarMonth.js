import './CalendarMonthDays.js';
import './CalendarMonthYearHeader.js';
import './CalendarWeekDaysHeader.js';
import { merge } from './updates.js';
import { symbols } from './elix.js';
import * as template from './template.js';
import CalendarElementMixin from './CalendarElementMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  CalendarElementMixin(
    ReactiveElement
  );


class CalendarMonth extends Base {

  get days() {
    if (!this.shadowRoot) {
      return null;
    }
    /** @type {any} */
    const cast = this.$.monthDays;
    return cast.days;
  }

  get daysOfWeekFormat() {
    return this.state.daysOfWeekFormat;
  }
  set daysOfWeekFormat(daysOfWeekFormat) {
    this.setState({ daysOfWeekFormat });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      daysOfWeekFormat: 'short'
    });
  }

  // TODO: roles
  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
        }

        #monthYearHeader {
          display: block;
          font-size: larger;
          font-weight: bold;
          padding: 0.3em;
        }

        #monthTable {
          border-collapse: collapse;
          display: table;
          width: 100%;
        }

        #weekDaysHeader {
          display: table-header-group;
          font-size: smaller;
        }
      </style>

      <elix-calendar-month-year-header id="monthYearHeader"></elix-calendar-month-year-header>
      <div id="monthTable">
        <elix-calendar-week-days-header id="weekDaysHeader" format="short"></elix-calendar-week-days-header>
        <elix-calendar-month-days id="monthDays"></elix-calendar-month-days>
      </div>
    `;
  }

  get updates() {
    const { date, daysOfWeekFormat, locale } = this.state;
    return merge(super.updates, {
      $: {
        monthDays: {
          date,
          locale
        },
        monthYearHeader: {
          date,
          locale
        },
        weekDaysHeader: {
          format: daysOfWeekFormat,
          locale
        }
      }
    });
  }

  get weeks() {
    if (!this.shadowRoot) {
      return null;
    }
    /** @type {any} */
    const cast = this.$.monthDays;
    return cast.weeks;
  }

}


export default CalendarMonth;
customElements.define('elix-calendar-month', CalendarMonth);
