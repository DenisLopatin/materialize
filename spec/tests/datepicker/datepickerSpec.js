describe('Datepicker Plugin', () => {
  const fixture = `<div class="row">
  <div class="input-field col s12">
    <input type="text" class="datepicker" id="datepickerInput">
  </div>
</div>`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('Datepicker', () => {
    afterEach(() => {
      M.Datepicker.getInstance(document.querySelector('.datepicker')).destroy();
    });

    it('can have a string format', (done) => {
      const input = document.querySelector('#datepickerInput');
      const today = new Date();
      M.Datepicker.init(input, { format: 'mm/dd/yyyy' });
      const datepicker = M.Datepicker.getInstance(input);
      //datepicker.open();
      setTimeout(() => {
        const day1 = document.querySelector('.datepicker-modal button[data-day="1"]');
        day1.click();
        document.querySelector('.datepicker-done').click();
        setTimeout(() => {
          const year = today.getFullYear();
          const month = today.getMonth() + 1;
          const value = datepicker.toString();
          expect(value).toEqual(`${month < 10 ? `0${month}` : month}/01/${year}`);
          done();
        }, 400);
      }, 400);
    });

    it('can have a format function', (done) => {
      const input = document.querySelector('#datepickerInput');
      const today = new Date();
      const formatFn = `${today.getFullYear() - 100}-${today.getMonth() + 1}-99`;
      M.Datepicker.init(input, { format: formatFn });
      const datepicker = M.Datepicker.getInstance(input);
      //datepicker.open();
      setTimeout(() => {
        const day1 = document.querySelector('.datepicker-modal button[data-day="1"]');
        day1.click();
        document.querySelector('.datepicker-done').click();
        setTimeout(() => {
          const year = today.getFullYear() - 100;
          const month = today.getMonth() + 1;
          expect(datepicker.toString()).toEqual(`${year}-${month}-99`);
          done();
        }, 400);
      }, 400);
    });

    it('can change the calendar modal selected date by input', (done) => {
      const input = document.querySelector('#datepickerInput');
      M.Datepicker.init(input, { format: 'mm/dd/yyyy' });
      const today = new Date();
      const month = today.getMonth();
      const year = today.getFullYear() - 44;
      const day = 11;
      input.value = `${month + 1}/${day}/${year}`;
      input.dispatchEvent(new InputEvent('change', { bubbles: true, cancelable: true }));
      input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 13 }));
      setTimeout(() => {
        const selectMonthElem = document.querySelector('.datepicker-select.orig-select-month');
        const selectYearElem = document.querySelector('.datepicker-select.orig-select-year');
        const selectedDayElem = document.querySelector(`.datepicker-row td[data-day="${day}"]`);
        expect(selectMonthElem.querySelector('option[selected="selected"]').value)
          .withContext(
          'selected month does not match'
        ).toBe((month).toString());
        expect(selectYearElem.querySelector('option[selected="selected"]').value)
          .withContext(
          'selected year does not match'
        ).toBe(year.toString());
        expect(selectedDayElem.classList.contains('is-selected')).withContext(
          'selected day does not match'
        ).toBe(true);
        done();
      }, 10);
    });

    it('should have a date range input field if date range option is enabled', (done) => {
      const input = document.querySelector('#datepickerInput');
      M.Datepicker.init(input, { isDateRange: true });
      setTimeout(() => {
        expect(document.querySelector('.datepicker-end-date')).toExist(
          'end date input should exist'
        );
        done();
      }, 10);
    });

    it('should have multiple input fields if multiple select option is enabled and multiple dates are selected', (done) => {
      const input = document.querySelector('#datepickerInput');
      M.Datepicker.init(input, { isMultipleSelection: true });
      const datepicker = M.Datepicker.getInstance(input);
      datepicker.open();
      setTimeout(() => {
        for (let i = 1; i < 4; i++) {
          setTimeout(() => {
            document.querySelector(`.datepicker-modal button[data-day="${i}"]`).click();
          }, i * 10);
        }
        setTimeout(() => {
          document.querySelector('.datepicker-done').click();
          expect(document.querySelectorAll('.datepicker').length === 3).toEqual(true);
          done();
        }, 40);
      }, 10);
    });
  });
});
