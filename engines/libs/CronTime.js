let Helpers = {
    spliceIntoPosition($position, $value, $str = undefined) {
        if ($str === undefined) {
            $str = this.minute();
        }

        let $default = $str.split(' ');
        $default.splice($position, 1, $value);
        return $default.join(' ');
    },

    minute() {
        return '* * * * *';
    },

    hour() {
        return this.spliceIntoPosition(0, 0)
    },

    day($value = 0) {
        return this.spliceIntoPosition(1, $value, this.hour())
    },

    sunday($hourOfTheDay = 0) {
        return `0 ${$hourOfTheDay} * * SUN`
    },

    monday($hourOfTheDay = 0) {
        return `0 ${$hourOfTheDay} * * MON`
    },

    tuesday($hourOfTheDay = 0) {
        return `0 ${$hourOfTheDay} * * TUE`
    },

    wednesday($hourOfTheDay = 0) {
        return `0 ${$hourOfTheDay} * * WED`
    },

    thursday($hourOfTheDay = 0) {
        return `0 ${$hourOfTheDay} * * THU`
    },

    friday($hourOfTheDay = 0) {
        return `0 ${$hourOfTheDay} * * FRI`
    },

    saturday($hourOfTheDay = 0) {
        return `0 ${$hourOfTheDay} * * SAT`
    },

    month($value = 1) {
        return this.spliceIntoPosition(2, $value, this.day())
    }
};

class EveryTime {
    constructor($every, $config = {}) {
        if ($every === 'even') $every = 2;
        this.interval = $every;

        this.config = Object.assign(this.config, $config);
        return this;
    }

    minutes() {
        if (this.config['between']) {
            return Helpers.spliceIntoPosition(0, this.interval.join('-'), Helpers.minute())
        }

        if (typeof this.interval === 'number' && this.interval > 1) {
            return Helpers.spliceIntoPosition(0, '*/' + this.interval);
        } else if (this.interval === 'uneven') {
            return Helpers.spliceIntoPosition(0, '1-59/2');
        }

        return Helpers.minute();
    }

    hours() {
        if (this.config['between']) {
            return Helpers.spliceIntoPosition(1, this.interval.join('-'), Helpers.hour())
        }

        if (typeof this.interval === 'number' && this.interval > 1) {
            return Helpers.spliceIntoPosition(1, '*/' + this.interval);
        } else if (this.interval === 'uneven') {
            return Helpers.spliceIntoPosition(1, '1-23/2');
        }

        return Helpers.hour();
    }

    days() {
        if (this.config['at']) {
            return Helpers.spliceIntoPosition(2, this.config.at, Helpers.day())
        }

        if (this.config['between']) {
            return Helpers.spliceIntoPosition(2, this.interval.join('-'), Helpers.day())
        }

        if (typeof this.interval === 'number' && this.interval > 1) {
            return Helpers.spliceIntoPosition(2, '*/' + this.interval, Helpers.day());
        } else if (this.interval === 'uneven') {
            return Helpers.spliceIntoPosition(2, '1-31/2', Helpers.day());
        }

        return Helpers.day();
    }
}

EveryTime.prototype.interval = 1;
EveryTime.prototype.config = {};

class CronTime {
    at($at) {
        this.$at = $at;
        return this;
    }

    every($int) {
        return new EveryTime($int);
    }

    everyMinute() {
        return Helpers.minute();
    }

    everyHour() {
        return Helpers.hour();
    }

    everyDay() {
        return Helpers.day();
    }

    everyDayAt($hourOfTheDay) {
        return Helpers.day($hourOfTheDay);
    }

    everySunday() {
        return Helpers.sunday();
    }

    everySundayAt($hourOfTheDay) {
        return Helpers.sunday($hourOfTheDay);
    }


    everyMonday() {
        return Helpers.monday();
    }

    everyMondayAt($hourOfTheDay) {
        return Helpers.monday($hourOfTheDay);
    }

    everyTuesday() {
        return Helpers.tuesday();
    }

    everyTuesdayAt($hourOfTheDay) {
        return Helpers.tuesday($hourOfTheDay);
    }

    everyWednesday() {
        return Helpers.wednesday();
    }

    everyWednesdayAt($hourOfTheDay) {
        return Helpers.wednesday($hourOfTheDay);
    }

    everyThursday() {
        return Helpers.thursday();
    }

    everyThursdayAt($hourOfTheDay) {
        return Helpers.thursday($hourOfTheDay);
    }

    everyFriday() {
        return Helpers.friday();
    }

    everyFridayAt($hourOfTheDay) {
        return Helpers.friday($hourOfTheDay);
    }

    everySaturday() {
        return Helpers.saturday();
    }

    everySaturdayAt($hourOfTheDay) {
        return Helpers.saturday($hourOfTheDay);
    }

    everyMonth() {
        return Helpers.month();
    }

    everyMonthOn($dayOfTheMonth = 1) {
        return Helpers.month($dayOfTheMonth);
    }

    between($start, $end) {
        return new EveryTime([$start, $end], {between: true})
    }

}

CronTime.prototype.$at = -1;

module.exports = CronTime;