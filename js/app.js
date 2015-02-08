var model = {
  attendanceList : {},
  attendanceLength: 12,

  init: function() {
    var self = this;

    if (!localStorage.attendance) {
      var defaultList = {
        'Slappy the Frog': [],
        'Lilly the Lizard': [],
        'Paulrus the Walrus': [],
        'Gregory the Goat': [],
        'Adam the Anaconda': [],
      };

      $.each(defaultList, function(name) {
        var list = [];
        for (var i = 0; i < self.attendanceLength; i++) {
          list.push(true);
        }
        defaultList[name] = list;
      });

      localStorage.attendance = JSON.stringify(defaultList);
    }

    this.load();
  },

  persist: function() {
    localStorage.attendance = JSON.stringify(this.attendanceList);
  },

  load: function() {
    this.attendanceList = JSON.parse(localStorage.attendance);
  }
};


var octopus = {
  init: function() {
    model.init();
    attendanceView.init();
  },

  getAttendanceList: function() {
    return model.attendanceList;
  },

  getAttendanceLength: function() {
    return model.attendanceLength;
  },

  getStudentMissedCount: function(studentName) {
    var attendance = model.attendanceList[studentName];
    var missedCount = 0;
    for (var i = 0, l = attendance.length; i < l; i++) {
      if (attendance[i] === false) {
        missedCount += 1;
      }
    }
    return missedCount;
  },

  updateStudentAttendance: function(name, dayIndex, value) {
    model.attendanceList[name][dayIndex] = value;
    attendanceView.render();
    model.persist();
  }
};


var attendanceView = {
  init: function() {
    this.rowContainer = $('tbody');

    var row = $('<tr>');
    var studentCol = $('<th class="name-col">)');
    studentCol.text('Student Name')
    row.append(studentCol);

    var attendanceLength = octopus.getAttendanceLength();
    for (var j = 1; j <= attendanceLength; j++) {
      var col = $('<th>');
      col.text(j);
      row.append(col);
    }

    var missedCol = $('<th class="missed-col">');
    missedCol.text('Days missed-col');
    row.append(missedCol);

    this.header = $('thead');
    this.header.append(row);

    this.render();
  },

  render: function() {
    var self = this;
    self.rowContainer.html('');
    var list = octopus.getAttendanceList();

    $.each(list, function (name, attendance) {
      var row = $('<tr class="student">');
      var studentCol = $('<td class="name-col">)');
      studentCol.text(name)
      row.append(studentCol);

      var attendanceLength = octopus.getAttendanceLength();

      for (var j = 0; j < attendanceLength; j++) {
        var col = $('<td class="attend-col">');
        var checkbox = $('<input type="checkbox">');
        checkbox.prop('checked', attendance[j])

        checkbox.on('click', (function(name, dayIndex) {
          return function() {
            var newValue = $(this).prop('checked');
            octopus.updateStudentAttendance(name, dayIndex, newValue);
          };
        })(name, j));

        col.append(checkbox);
        row.append(col);
      }

      var missedCol = $('<td class="missed-col">');
      var missedCount = octopus.getStudentMissedCount(name);
      missedCol.text(missedCount);
      row.append(missedCol);

      self.rowContainer.append(row);
    });
  }
};

octopus.init();
