(function () {
  const html = `
    <div style="display: table; width: 100%;">
      <div style="display: table-cell; width: 50%; vertical-align: top;">
        <h1 class="total_time">00:00:00</h1>
        <div class="sys_clock">
          <div>My computer's clock is
            <select style="margin: 0px; width: 5em;">
              <option>ahead</option>
              <option>behind</option>
            </select> of punch machine clock by
            <input type="number" placeholder="hrs" min="0" max="24" style="width: 3em; margin: 0px;">:<input type="number" placeholder="min" min="0" max="60" style="width: 3em; margin: 0px;">:<input type="number" placeholder="sec" min="0" max="60" style="width: 3em; margin: 0px;">
          </div>
        </div>
      </div>
      <div style="display: table-cell; width: 50%; vertical-align: top;">
        <div class="swipe_data">
          <div>Swipe Data - <span style="font-weight: bold; font-style: italic;" class="date"></span></div>
          <table></table>
        </div>
      </div>
    </div>
  `;

  const $el_calc = $('<div/>');
  $($el_calc).attr('id', 'itc_wrapper').html(html);

  $(document.body).prepend($el_calc);
  $('.navbar').css('position', 'relative');
}());