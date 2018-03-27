(function () {
  const html = `
    <div style="display: table; width: 100%;">
      <div style="display: table-cell; width: 50%; vertical-align: top;">
        <h1 class="total_time">00:00:00</h1>
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