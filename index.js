const { toXML } = require('jstoxml')
const axios = require('axios')
const fs = require('fs')
require('dotenv').config()

const addressServer = process.env.ADDRESS_SERVER || 'http://localhost:4000'


const getStantions = async () => {
    return new Promise((func1) => {
        let listStations = [];
        (function fetchStation(page = 1) {
            axios.get(`${addressServer}/api/ezses?populate=*&pagination[page]=${page}&pagination[pageSize]=100`)
                .then(res => {
                    listStations = listStations.concat(res.data.data)
                    if (res.data.meta.pagination.page !== res.data.meta.pagination.pageCount) {
                        fetchStation(page + 1)
                    } else {
                        func1(listStations)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        })()
    })
}
getStantions().then((list) => {
    // console.log(list)
    const text = toXML(list.map(item => ({
        "company":
            [
                {
                    _name: "company-id",
                    _content: "000" + item.id,
                    _attrs: {
                    }
                },
                {
                    _name: "actualization-date",
                    _content: Math.floor(new Date().getTime() / 1000),
                    _attrs: {
                    }
                },
                {
                    _name: "rubric-id",
                    _content: '43752131937',
                    _attrs: {
                    }
                },
                {
                    _name: "name",
                    _content: "МОСОБЛЭНЕРГО",
                    _attrs: {
                        lang: 'ru'
                    }
                },
                {
                    _name: "name-other",
                    _content: "Электрическая Зарядная Станция",

                    _attrs: {
                        lang: 'ru'
                    }
                },
                {
                    _name: "shortname",
                    _content: "ЭЗС",
                    _attrs: {
                        lang: 'ru'
                    }
                },
                {
                    _name: "address",
                    _content: item.attributes.address,
                    _attrs: {
                        lang: 'ru'
                    }
                },
                {
                    _name: "address-add",
                    _content: item.attributes.address_clarification,
                    _attrs: {
                        lang: 'ru'
                    }
                },
                {
                    _name: "country",
                    _content: "Россия",
                    _attrs: {
                        lang: 'ru'
                    }
                },
                {
                    _name: "phone",
                    _content: { "number": item.attributes.support_phone_number.substr(6), "type": "phone", "info": "Тех. поддержка" },
                    _attrs: {
                    }
                },
                {
                    _name: "url",
                    _content: "https://mosoblenergo.ru",
                    _attrs: {
                    }
                },
                {
                    _name: "info-page",
                    _content: "https://mosoblenergo.ru/chargingstations",
                    _attrs: {
                    }
                },
                {
                    _name: "working-time",
                    _content: item.attributes.operating_mode,
                    _attrs: {
                        lang: 'ru'
                    }
                },
                {
                    _name: "coordinates",
                    _content: { "lon": item.attributes.longitude, "lat": item.attributes.latitude, },
                    _attrs: {
                    }
                },
                {
                    _name: "feature-enum-single",
                    _attrs: {
                        name: 'Тип разьема',
                        value: item.attributes.connector_type,
                    }
                },
                {
                    _name: "feature-enum-single",
                    _attrs: {
                        name: 'Метод установки',
                        value: item.attributes.method_of_installation,
                    }
                },
                {
                    _name: "feature-numeric-single",
                    _attrs: {
                        name: 'Мощность',
                        value: item.attributes.power,
                    }
                },
                {
                    _name: "feature-enum-single",
                    _attrs: {
                        name: 'Режим зарядки',
                        value: item.attributes.charging_mode,
                    }
                },
                {
                    _name: "feature-enum-single",
                    _attrs: {
                        name: 'Мобильное приложение',
                        value: item.attributes.mobile_applications,
                    }
                },
            ]

    }))
    );
    // console.log(`<?xml version="1.0" encoding="UTF-8"?><companies>` + text + `</companies>`)
    fs.writeFileSync("./public/forYandex.xml", `<?xml version="1.0" encoding="UTF-8"?><companies>` + text + `</companies>`)
})
