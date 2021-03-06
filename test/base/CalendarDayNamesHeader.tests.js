import { assert } from "../testHelpers.js";
import { trimMarks } from "../normalize.js";
import * as internal from "../../src/base/internal.js";
import CalendarDayNamesHeader from "../../define/CalendarDayNamesHeader.js";

describe("CalendarDayNamesHeader", () => {
  it("renders short English US week days", async () => {
    const fixture = new CalendarDayNamesHeader();
    fixture.locale = "en-US";
    await fixture[internal.renderChanges]();
    assert.equal(trimMarks(fixture[internal.ids].day0.textContent), "Sun");
    assert.equal(trimMarks(fixture[internal.ids].day1.textContent), "Mon");
    assert.equal(trimMarks(fixture[internal.ids].day2.textContent), "Tue");
    assert.equal(trimMarks(fixture[internal.ids].day3.textContent), "Wed");
    assert.equal(trimMarks(fixture[internal.ids].day4.textContent), "Thu");
    assert.equal(trimMarks(fixture[internal.ids].day5.textContent), "Fri");
    assert.equal(trimMarks(fixture[internal.ids].day6.textContent), "Sat");
  });

  it("renders narrow English US week days", async () => {
    const fixture = new CalendarDayNamesHeader();
    fixture.locale = "en-US";
    fixture.format = "narrow";
    await fixture[internal.renderChanges]();
    // Edge shows "Su", everyone else shows "S".
    const trimmed = trimMarks(fixture[internal.ids].day0.textContent);
    assert(trimmed === "S" || trimmed === "Su");
  });

  it("renders short French week days", async () => {
    const fixture = new CalendarDayNamesHeader();
    fixture.locale = "fr-FR";
    await fixture[internal.renderChanges]();
    assert.equal(trimMarks(fixture[internal.ids].day0.textContent), "lun."); // A Monday
    assert.equal(trimMarks(fixture[internal.ids].day1.textContent), "mar.");
    assert.equal(trimMarks(fixture[internal.ids].day2.textContent), "mer.");
    assert.equal(trimMarks(fixture[internal.ids].day3.textContent), "jeu.");
    assert.equal(trimMarks(fixture[internal.ids].day4.textContent), "ven.");
    assert.equal(trimMarks(fixture[internal.ids].day5.textContent), "sam.");
    assert.equal(trimMarks(fixture[internal.ids].day6.textContent), "dim.");
  });
});
