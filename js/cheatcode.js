(function() {
  function noop() {}

  var LEFT = 37;
  var UP = 38;
  var RIGHT = 39;
  var DOWN = 40;
  var LETTER_A = 65;
  var LETTER_B = 66;

  function on(el, event, fn, capture) {
    capture = !!capture;
    el.addEventListener(event, fn, capture);
    return function() { el.removeEventListener(event, fn, capture) };
  }

  function Keys(spec, opts) {
    opts || (opts = {});
    this.spec = spec;
    this.icons = [];
    this.success = opts.success || noop;
    this.failure = opts.failure || noop;
    this.init();
  }

  Keys.prototype.init = function() {
    var overlay = document.createElement('div');
    var modal = document.createElement('div');
    var icons = this.icons;

    overlay.classList.add('modal-overlay');
    modal.classList.add('modal');

    // add shaker classes
    modal.classList.add('shake-horizontal', 'shake-constant', 'shake-little');
    overlay.appendChild(modal);

    this.spec.forEach(function(key) {
      var icon = mkIcon(key);
      icons.push(icon);
      modal.appendChild(icon);
    });

    this.overlay = overlay;
    this.modal = modal;
  };

  Keys.prototype.prompt = function() {
    document.body.appendChild(this.overlay);
    var keys = this;
    this.unbind = on(document, 'keydown', function(event) {
      keys.check(event.keyCode);
    });
  };

  Keys.prototype.check = function(code) {
    this.index || (this.index = 0);
    var icon = this.icons[this.index];
    if (code == icon.code) {
      this.index++;
      icon.classList.add('correct');
      if (this.index >= this.icons.length) {
        this.success();
        this.remove();
      }
    } else {
      this.unbind();
      this.failure();
      this.reset();
    }
  };

  Keys.prototype.reset = function() {
    this.icons.forEach(function(icon) {
      icon.classList.remove('correct');
    });
    this.index = 0;
  };

  Keys.prototype.remove = function() {
    this.unbind();
    this.overlay.remove();
  }

  function mkIcon(key) {
    var icon = document.createElement('i');
    switch(key) {
      case 'up':
        $(icon).text('↑');
        // $(icon).text('⬆︎');
        icon.code = UP;
        break;
      case 'down':
        $(icon).text('↓');
        // $(icon).text('⬇︎');
        icon.code = DOWN;
        break;
      case 'left':
        $(icon).text('←');
        // $(icon).text('⬅︎');
        icon.code = LEFT;
        break;
      case 'right':
        $(icon).text('→');
        // $(icon).text('➡︎');
        // $(icon).text('→➞⬅︎⬆︎⬇︎➔➜');
        icon.code = RIGHT;
        break;
      case 'a':
        $(icon).text('A');
        icon.code = LETTER_A;
        break;
      case 'b':
        $(icon).text('B');
        icon.code = LETTER_B;
        break;
    }
    return icon;
  }

  window.Keys = Keys;
})()
