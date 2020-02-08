const request = require('request');
const util = require('util');
const JSONbig = require('json-bigint');

const portal = 'https://owner-api.teslamotors.com/api/1';
const owner_api = 'https://owner-api.teslamotors.com';
exports.portal = owner_api;
let token = '';
exports.token = token;

const version = '2.1.79';
const model = 'SM-G900V';
const codename = 'REL';
const release = '4.4.4';
const locale = 'en_US';
const user_agent = `Model S ${version} (${model}; Android ${codename} ${release}; ${locale})`;
const x_tesla_user_agent = 'TeslaApp/3.4.4-350/fad4a582e/android/9.0.0';

let http_header;

const report = (error, { statusCode }, body, cb) => {
    if (!!cb) cb(error || (new Error(`${statusCode}: ${body}`)), body);
};

const report2 = (call, body, cb) => {
    if (typeof cb === 'function') cb(new Error(`expecting JSON response to ${call} request`), body);
};

const all = exports.all = (options, cb) => {
    if (!cb) cb = (error, response, body) => {/* jshint unused: false */ };
    if (options.token) {
        exports.token = options.token;
        // set common HTTP Header used for all requests
        http_header = {
            'Authorization': `Bearer ${options.token}`,
            'Content-Type': 'application/json; charset=utf-8',
            'User-Agent': user_agent,
            'X-Tesla-User-Agent': x_tesla_user_agent
        };
        request({
            method: 'GET',
            url: `${portal}/vehicles`,
            gzip: true,
            headers: http_header
        }, cb);
    }
};

const vehicles = exports.vehicles = (options, cb) => {
    if (!cb) cb = data => {/* jshint unused: false */ };

    all(options, (error, response, body) => {
        let data;

        try { data = JSONbig.parse(body); } catch (err) { return cb(new Error(`login failed\nerr: ${err}\nbody: ${body}`)); }
        if (!util.isArray(data.response)) return cb(new Error('expecting an array from Tesla Motors cloud service'));
        data = data.response[0];
        data.id = JSONbig.stringify(data.id);
        cb((!!data.id) ? data : (new Error('expecting vehicle ID from Tesla Motors cloud service')));
    });
};

exports.get_vid = (options, cb) => {
    vehicles(options, data => {
        if (!!data.id) data = data.id; if (!!cb) cb(data);
    });
};

function set_token(token) {
    exports.token = token;
    http_header = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': user_agent,
    };
}
exports.set_token = set_token;


function mobile_enabled(vid, cb) {
    request({
        method: 'GET',
        url: `${portal}/vehicles/${vid}/mobile_enabled`,
        gzip: true,
        headers: http_header
    }, (error, response, body) => {
        if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
        try {
            const data = JSON.parse(body);
            if (typeof cb == 'function') return cb(data.response);
            else return true;
        } catch (err) {
            return report2('mobile_enabled', body, cb);
        }
    });
}
exports.mobile_enabled = mobile_enabled;

function get_charge_state(vid, cb) {
    request({
        method: 'GET',
        url: `${portal}/vehicles/${vid}/data_request/charge_state`,
        gzip: true,
        headers: http_header
    }, (error, response, body) => {
        if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
        try {
            const data = JSON.parse(body);
            if (typeof cb == 'function') return cb(data.response);
            else return true;
        } catch (err) {
            return report2('charge_state', body, cb);
        }
    });
}
exports.get_charge_state = get_charge_state;

function get_climate_state(vid, cb) {
    request({
        method: 'GET',
        url: `${portal}/vehicles/${vid}/data_request/climate_state`,
        gzip: true,
        headers: http_header
    }, (error, response, body) => {
        if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
        try {
            const data = JSON.parse(body);
            if (typeof cb == 'function') return cb(data.response);
            else return true;
        } catch (err) {
            return report2('climate_state', body, cb);
        }
    });
}
exports.get_climate_state = get_climate_state;

function get_drive_state(vid, cb) {
    request({
        method: 'GET',
        url: `${portal}/vehicles/${vid}/data_request/drive_state`,
        gzip: true,
        headers: http_header
    }, (error, response, body) => {
        if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
        try {
            const data = JSON.parse(body);
            if (typeof cb == 'function') return cb(data.response);
            else return true;
        } catch (err) {
            return report2('drive_state', body, cb);
        }
    });
}
exports.get_drive_state = get_drive_state;

function get_vehicle_state(vid, cb) {
    request({
        method: 'GET',
        url: `${portal}/vehicles/${vid}/data_request/vehicle_state`,
        gzip: true,
        headers: http_header
    }, (error, response, body) => {
        if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
        try {
            const data = JSON.parse(body);
            if (typeof cb == 'function') return cb(data.response);
            else return true;
        } catch (err) {
            return report2('vehicle_state', body, cb);
        }
    });
}
exports.get_vehicle_state = get_vehicle_state;

function get_gui_settings(vid, cb) {
    request({
        method: 'GET',
        url: `${portal}/vehicles/${vid}/data_request/gui_settings`,
        gzip: true,
        headers: http_header
    }, (error, response, body) => {
        if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
        try {
            const data = JSON.parse(body);
            if (typeof cb == 'function') return cb(data.response);
            else return true;
        } catch (err) {
            return report2('gui_settings', body, cb);
        }
    });
}
exports.get_gui_settings = get_gui_settings;

function wake_up(vid, cb) {
    request({
        method: 'POST',
        url: `${portal}/vehicles/${vid}/command/wake_up`,
        gzip: true,
        headers: http_header
    }, (error, response, body) => {
        if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
        try {
            const data = JSON.parse(body);
            if (typeof cb == 'function') return cb(data.response);
            else return true;

        } catch (err) {
            return report2('wake_up', body, cb);
        }
    });
}
exports.wake_up = wake_up;

function open_charge_port(vid, cb) {
    request({
        method: 'POST',
        url: `${portal}/vehicles/${vid}/command/charge_port_door_open`,
        gzip: true,
        headers: http_header
    }, (error, response, body) => {
        if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
        try {
            const data = JSON.parse(body);
            if (typeof cb == 'function') return cb(data.response);
            else return true;
        } catch (err) {
            return report2('charge_port_door_open', body, cb);
        }
    });
}
exports.open_charge_port = open_charge_port;

const CHARGE_OFF = 0;
const CHARGE_ON = 1;
function charge_state({ id, charge }, cb) {
    const vid = id;
    let state = charge;

    if (state == CHARGE_ON || state == "on" || state == "start" || state === true) {
        state = "start";
    }

    if (state == CHARGE_OFF || state == "off" || state == "stop" || state === false) {
        state = "stop";
    }

    if (state == "start" || state == "stop") {
        request({
            method: 'POST',
            url: `${portal}/vehicles/${vid}/command/charge_${state}`,
            gzip: true,
            headers: http_header
        }, (error, response, body) => {
            if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
            try {
                const data = JSON.parse(body);
                if (typeof cb == 'function') return cb(data.response);
                else return true;
            } catch (err) {
                return report2(`charge_${state}`, body, cb);
            }
        });
    } else {
        if (typeof cb == 'function') return cb(new Error(`Invalid charge state = ${state}`));
        else return false;
    }
}
exports.charge_state = charge_state;
exports.CHARGE_OFF = CHARGE_OFF;
exports.CHARGE_ON = CHARGE_ON;

const RANGE_STD = 0;
const RANGE_MAX = 1;
function charge_range(params, cb) {
    const vid = params.id;
    let range = params.range;
    const percent = params.percent;
    if (range == RANGE_STD || range == "std" || range == "standard") {
        range = "standard";
    }
    if (range == RANGE_MAX || range == "max" || range == "max_range") {
        range = "max_range";
    }
    if (range == "standard" || range == "max_range") {
        request({
            method: 'POST',
            url: `${portal}/vehicles/${vid}/command/charge_${range}`,
            gzip: true,
            headers: http_header
        }, (error, response, body) => {
            if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
            try {
                const data = JSON.parse(body);
                if (typeof cb == 'function') return cb(data.response);
                else return true;
            } catch (err) {
                return report2(`charge_${range}`, body, cb);
            }
        });
    } else if (range == "set" && (percent >= 50) && (percent <= 100)) {
        request({
            method: 'POST',
            url: `${portal}/vehicles/${vid}/command/set_charge_limit`,
            gzip: true,
            headers: http_header,
            form: {
                "percent": percent.toString()
            }
        }, (error, response, body) => {
            if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
            try {
                const data = JSON.parse(body);
                if (typeof cb == 'function') return cb(data.response);
                else return true;
            } catch (err) {
                return report2('set_charge_limit', body, cb);
            }
        });
    } else {
        if (typeof cb == 'function') return cb(new Error(`Invalid charge range = ${range}`));
        else return false;
    }
}
exports.charge_range = charge_range;
exports.RANGE_STD = RANGE_STD;
exports.RANGE_MAX = RANGE_MAX;

function flash(vid, cb) {
    request({
        method: 'POST',
        url: `${portal}/vehicles/${vid}/command/flash_lights`,
        gzip: true,
        headers: http_header
    }, (error, response, body) => {
        if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
        try {
            const data = JSON.parse(body);
            if (typeof cb == 'function') return cb(data.response);
            else return true;
        } catch (err) {
            return report2('flash_lights', body, cb);
        }
    });
}
exports.flash = flash;

function honk(vid, cb) {
    request({
        method: 'POST',
        url: `${portal}/vehicles/${vid}/command/honk_horn`,
        gzip: true,
        headers: http_header
    }, (error, response, body) => {
        if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
        try {
            const data = JSON.parse(body);
            if (typeof cb == 'function') return cb(data.response);
            else return true;
        } catch (err) {
            return report2('honk_horn', body, cb);
        }
    });
}
exports.honk = honk;

const LOCK_OFF = 0;
const LOCK_ON = 1;
function door_lock({ id, lock }, cb) {
    const vid = id;
    const state = lock;
    if (state == "lock" || state === true || state == "on" || state == "close") {
        request({
            method: 'POST',
            url: `${portal}/vehicles/${vid}/command/door_lock`,
            gzip: true,
            headers: http_header
        }, (error, response, body) => {
            if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
            try {
                const data = JSON.parse(body);
                if (typeof cb == 'function') return cb(data.response);
                else return true;
            } catch (err) {
                return report2('door_lock', body, cb);
            }
        });
    } else if (state == "unlock" || state === false || state == "off" || state == "open") {
        request({
            method: 'POST',
            url: `${portal}/vehicles/${vid}/command/door_unlock`,
            gzip: true,
            headers: http_header
        }, (error, response, body) => {
            if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
            try {
                const data = JSON.parse(body);
                if (typeof cb == 'function') return cb(data.response);
                else return true;
            } catch (err) {
                return report2('door_unlock', body, cb);
            }
        });
    } else {
        if (typeof cb == 'function') return cb(new Error(`Invalid door lock state = ${state}`));
        else return false;
    }
}
exports.door_lock = door_lock;
exports.LOCK_OFF = LOCK_OFF;
exports.LOCK_ON = LOCK_ON;

const TEMP_HI = 31;
const TEMP_LO = 18;
function set_temperature(params, cb) {
    const dtemp = params.dtemp;
    let ptemp = params.ptemp;
    const vid = params.id;
    let error = false;

    if (!dtemp || dtemp > TEMP_HI || dtemp < TEMP_LO) {
        error = true;
    }

    if (ptemp === undefined) {
        ptemp = dtemp;
    }

    if (!ptemp || ptemp > TEMP_HI || ptemp < TEMP_LO) {
        error = true;
    }

    if (!error) {
        request({
            method: 'POST',
            url: `${portal}/vehicles/${vid}/command/set_temps`,
            gzip: true,
            headers: http_header,
            form: {
                "driver_temp": dtemp.toString(),
                "passenger_temp": ptemp.toString(),
            }
        }, (error, response, body) => {
            if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
            try {
                const data = JSON.parse(body);
                if (typeof cb == 'function') return cb(data.response);
                else return true;
            } catch (err) {
                return report2('set_temps', body, cb);
            }
        });
    } else {
        if (typeof cb == 'function') return cb(new Error(`Invalid temperature setting (${dtemp}C), Passenger (${ptemp}C)`));
        else return false;
    }
}
exports.set_temperature = set_temperature;
exports.TEMP_HI = TEMP_HI;
exports.TEMP_LO = TEMP_LO;


const CLIMATE_OFF = 0;
const CLIMATE_ON = 1;
function auto_conditioning({ id, climate }, cb) {
    const vid = id;
    let state = climate;
    if (state == CLIMATE_ON) { state = true; }
    if (state == CLIMATE_OFF) { state = false; }
    if (state == "start" || state === true || state == "on") {
        request({
            method: 'POST',
            url: `${portal}/vehicles/${vid}/command/auto_conditioning_start`,
            gzip: true,
            headers: http_header
        }, (error, response, body) => {
            if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
            try {
                const data = JSON.parse(body);
                if (typeof cb == 'function') return cb(data.response);
                else return true;
            } catch (err) {
                return report2('auto_conditioning_start', body, cb);
            }
        });
    } else if (state == "stop" || state === false || state == "off") {
        request({
            method: 'POST',
            url: `${portal}/vehicles/${vid}/command/auto_conditioning_stop`,
            gzip: true,
            headers: http_header
        }, (error, response, body) => {
            if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
            try {
                const data = JSON.parse(body);
                if (typeof cb == 'function') return cb(data.response);
                else return true;
            } catch (err) {
                return report2('auto_conditioning_stop', body, cb);
            }
        });
    } else {
        if (typeof cb == 'function') return cb(new Error(`Invalid auto conditioning state = ${state}`));
        else return false;
    }
}
exports.auto_conditioning = auto_conditioning;
exports.CLIMATE_OFF = CLIMATE_OFF;
exports.CLIMATE_ON = CLIMATE_ON;

const ROOF_CLOSE = 0;
const ROOF_VENT = 1;
const ROOF_COMFORT = 2;
const ROOF_OPEN = 3;
function sun_roof(params, cb) {
    const vid = params.id;
    let state = params.roof;
    const percent = params.percent;
    // add a check that  their is a sunroof on the car??
    if (state == ROOF_CLOSE) { state = "close"; }
    if (state == ROOF_VENT) { state = "vent"; }
    if (state == ROOF_COMFORT) { state = "comfort"; }
    if (state == ROOF_OPEN) { state = "open"; }
    if (state == "open" || state == "close" || state == "comfort" || state == "vent") {
        request({
            method: 'POST',
            url: `${portal}/vehicles/${vid}/command/sun_roof_control`,
            gzip: true,
            headers: http_header,
            form: {
                'state': state
            }
        }, (error, response, body) => {
            if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
            try {
                const data = JSON.parse(body);
                if (typeof cb == 'function') return cb(data.response);
                else return true;
            } catch (err) {
                return report2(`sun_roof_control ${state}`, body, cb);
            }
        });
    } else if ((state == "move") && (percent >= 0) && (percent <= 100)) {
        request({
            method: 'POST',
            url: `${portal}/vehicles/${vid}/command/sun_roof_control`,
            gzip: true,
            headers: http_header,
            form: {
                'state': 'move',
                'percent': percent.toString()
            }
        }, (error, response, body) => {
            if ((!!error) || (response.statusCode !== 200)) return report(error, response, body, cb);
            try {
                const data = JSON.parse(body);
                if (typeof cb == 'function') return cb(data.response);
                else return true;
            } catch (err) {
                return report2('sun_roof_control move', body, cb);
            }
        });
    } else {
        if (typeof cb == 'function') return cb(new Error(`Invalid sun roof state ${util.inspect(params)}`));
        else return false;
    }
}
exports.sun_roof = sun_roof;
exports.ROOF_CLOSE = ROOF_CLOSE;
exports.ROOF_VENT = ROOF_VENT;
exports.ROOF_COMFORT = ROOF_COMFORT;
exports.ROOF_OPEN = ROOF_OPEN;

exports.stream_columns = ['speed',
    'odometer',
    'soc',
    'elevation',
    'est_heading',
    'est_lat',
    'est_lng',
    'power',
    'shift_state',
    'range',
    'est_range',
    'heading'
];

exports.stream = ({ vehicle_id, email, password }, cb) => {
    if (!cb) cb = (error, response, body) => {/* jshint unused: false */ };

    request({
        method: 'GET',
        url: `https://streaming.vn.teslamotors.com/stream/${vehicle_id}/?values=${exports.stream_columns.join(',')}`,
        gzip: true,
        auth:
        {
            user: email,
            pass: password
        }
    }, cb);
};
