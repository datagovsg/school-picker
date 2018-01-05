import {optionsSelected} from 'helpers/util'
import {capitalize} from 'helpers/text'

export const homeSchoolDistance = {
  namespaced: true,
  state: {
    oneKm: [],
    twoKm: []
  },
  mutations: {
    setData (state, {oneKm, twoKm}) {
      state.oneKm = oneKm
      state.twoKm = twoKm
    }
  },
  actions: {
    queryOnemap (context, {postalCode, blkNo}) {
      context.commit('setData', {oneKm: [], twoKm: []})
      let url = window.location.origin + '/nearby-school'
      if (postalCode && blkNo) {
        url += `?postalcode=${postalCode}&hbn=${blkNo}`
        return window.fetch(url)
          .then(res => res.json())
          .then(json => context.commit('setData', json.result))
          .catch(err => console.error(err))
      }
    }
  }
}

export const schoolLevel = {
  state: {
    options: [
      {label: 'Primary', value: 'P'},
      {label: 'Secondary', value: 'S'},
      {label: 'Junior College', value: 'J'},
      {label: 'Pri 1 to Sec 4/5 (Mixed level)', value: 'F'},
      {label: 'Integrated Programme', value: 'T'}
    ],
    selected: null
  }
}

export const planningAreas = {
  namespaced: true,
  state: {
    options: [{
      label: 'CENTRAL',
      areas: [
        {label: 'Bishan', value: 'BS'},
        {label: 'Bukit Merah', value: 'BM'},
        {label: 'Bukit Timah', value: 'BT'},
        {label: 'Central Area', value: 'CA'},
        {label: 'Geylang', value: 'GL'},
        {label: 'Kallang', value: 'KL'},
        {label: 'Marine Parade', value: 'MP'},
        {label: 'Novena', value: 'NV'},
        {label: 'Queenstown', value: 'QT'},
        {label: 'Toa Payoh', value: 'TP'}
      ]
    }, {
      label: 'NORTH-EAST',
      areas: [
        {label: 'Ang Mo Kio', value: 'AM'},
        {label: 'Hougang', value: 'HG'},
        {label: 'Punggol', value: 'PG'},
        {label: 'Sengkang', value: 'SE'},
        {label: 'Serangoon', value: 'SG'}
      ]
    }, {
      label: 'WEST',
      areas: [
        {label: 'Bukit Batok', value: 'BK'},
        {label: 'Bukit Panjang', value: 'BP'},
        {label: 'Choa Chu Kang', value: 'CK'},
        {label: 'Clementi', value: 'CL'},
        {label: 'Jurong East', value: 'JE'},
        {label: 'Jurong West', value: 'JW'}
      ]
    }, {
      label: 'EAST',
      areas: [
        {label: 'Bedok', value: 'BD'},
        {label: 'Pasir Ris', value: 'PR'},
        {label: 'Tampines', value: 'TM'}
      ]
    }, {
      label: 'NORTH',
      areas: [
        {label: 'Sembawang', value: 'SB'},
        {label: 'Woodlands', value: 'WD'},
        {label: 'Yishun', value: 'YS'}
      ]
    }],
    selected: []
  },
  getters: {
    selectedDisplayText (state) {
      const label = []
      state.options.forEach(region => {
        if (optionsSelected(region, state.selected)) {
          label.push(capitalize(region.label) + ' Region')
        } else {
          region.areas.forEach(area => {
            if (optionsSelected(area, state.selected)) {
              label.push(area.label)
            }
          })
        }
      })

      label.sort(item => item.indexOf('Region') > -1 ? 0 : 1)
      // using &nbsp; unicode as space char are collapsed by html
      return label.join(',\u00A0\u00A0')
    }
  }
}

export const ccasOffered = {
  namespaced: true,
  state: {
    options: [{
      label: 'PHYSICAL SPORTS',
      ccas: [
        {label: 'Air Rifle / Shooting', value: 'CA001'},
        {label: 'Artistic Gymnastics', value: 'CA043'},
        {label: 'Athletics', value: 'CA047'},
        {label: 'Badminton', value: 'CA004'},
        {label: 'Basketball', value: 'CA005'},
        {label: 'Canoeing / Rowing / Dragon Boat', value: 'CA007'},
        {label: 'Cricket', value: 'CA008'},
        {label: 'Cross Country', value: 'CA009'},
        {label: 'Fencing', value: 'CA011'},
        {label: 'Floorball', value: 'CA035'},
        {label: 'Football', value: 'CA022'},
        {label: 'Frisbee', value: 'CA066'},
        {label: 'Golf', value: 'CA041'},
        {label: 'Hockey', value: 'CA014'},
        {label: 'House', value: 'CA053'},
        {label: 'Judo', value: 'CA015'},
        {label: 'Netball', value: 'CA018'},
        {label: 'Rhythmic Gymnastics', value: 'CA044'},
        {label: 'Rockwall Climbing', value: 'CA020'},
        {label: 'Rope Skipping', value: 'CA050'},
        {label: 'Rugby', value: 'CA019'},
        {label: 'Sailing', value: 'CA026'},
        {label: 'Sepak Takraw', value: 'CA021'},
        {label: 'Softball', value: 'CA023'},
        {label: 'Squash', value: 'CA024'},
        {label: 'Swimming', value: 'CA025'},
        {label: 'Table Tennis', value: 'CA028'},
        {label: 'Taekwondo', value: 'CA030'},
        {label: 'Tchoukball', value: 'CA071'},
        {label: 'Ten-pin Bowling', value: 'CA038'},
        {label: 'Tennis', value: 'CA029'},
        {label: 'Touch Rugby', value: 'CA039'},
        {label: 'Track & Field', value: 'CA027'},
        {label: 'Volleyball', value: 'CA033'},
        {label: 'Water Polo', value: 'CA031'},
        {label: 'Wushu', value: 'CA032'}
      ]
    }, {
      label: 'UNIFORMED GROUPS',
      'ccas': [
        {label: "Boys' Brigade", value: 'CB001'},
        {label: 'Brownies', value: 'CB014'},
        {label: 'Girl Guides', value: 'CB003'},
        {label: "Girls' Brigade", value: 'CB002'},
        {label: 'National Civil Defence Cadet Corps', value: 'CB015'},
        {label: 'NCC (Air)', value: 'CB010'},
        {label: 'NCC (Land)', value: 'CB011'},
        {label: 'NCC (Sea)', value: 'CB012'},
        {label: 'NPCC', value: 'CB005'},
        {label: 'Scouts', value: 'CB009'},
        {label: 'Singapore Red Cross Society', value: 'CB007'},
        {label: 'St. John Ambulance Brigade', value: 'CB006'}
      ]
    }, {
      label: 'VISUAL AND PERFORMING ARTS',
      ccas: [
        {label: 'Band - Brass', value: 'CC013'},
        {label: 'Band - Concert', value: 'CC041'},
        {label: 'Band - Military', value: 'CC009'},
        {label: 'Band - Pipe', value: 'CC050'},
        {label: 'Band - Symphonic', value: 'CC010'},
        {label: 'Chinese Drums', value: 'CC042'},
        {label: 'Choir', value: 'CC004'},
        {label: 'Dance - Chinese', value: 'CC029'},
        {label: 'Dance - Indian', value: 'CC030'},
        {label: 'Dance - International', value: 'CC028'},
        {label: 'Dance - Malay', value: 'CC031'},
        {label: 'Dance - Modern', value: 'CC026'},
        {label: 'Drama - Chinese', value: 'CC033'},
        {label: 'Drama - English', value: 'CC034'},
        {label: 'Ensemble - Angklung/kulintang', value: 'CC001'},
        {label: 'Ensemble - Gamelan', value: 'CC015'},
        {label: 'Ensemble - Guitar', value: 'CC005'},
        {label: 'Ensemble - Guzheng', value: 'CC016'},
        {label: 'Ensemble - Handbell/handchime', value: 'CC017'},
        {label: 'Ensemble - Harmonica', value: 'CC006'},
        {label: 'Ensemble - Percussion', value: 'CC022'},
        {label: 'Ensemble - String', value: 'CC007'},
        {label: "Musicians' Club", value: 'CC049'},
        {label: 'Orchestra - Chinese', value: 'CC003'}
      ]
    }, {
      label: 'CLUBS AND SOCIETIES',
      ccas: [
        {label: 'Art And Craft Club', value: 'CJ005'},
        {label: 'Chess Club', value: 'CJ014'},
        {label: 'Chess Club - Chinese', value: 'CJ182'},
        {label: 'Chinese Calligraphy And Brush Painting', value: 'CJ075'},
        {label: 'Chinese Cultural Society', value: 'CJ077'},
        {label: 'Chinese Society', value: 'CJ013'},
        {label: 'Christian Fellowship', value: 'CJ112'},
        {label: 'Computer Club', value: 'CJ016'},
        {label: 'Dance Society', value: 'CJ085'},
        {label: 'Debating And Oratorical Society', value: 'CJ023'},
        {label: 'Digital Video Club', value: 'CJ087'},
        {label: 'Entrepreneur Club', value: 'CJ154'},
        {label: 'Environmental Club', value: 'CJ202'},
        {label: 'Green Club', value: 'CJ094'},
        {label: 'Health And Fitness Club', value: 'CJ036'},
        {label: 'Home Economics', value: 'CJ217'},
        {label: 'Indian Cultural Society', value: 'CJ097'},
        {label: 'Infocom Club', value: 'CJ204'},
        {label: 'Innovation Society', value: 'CJ146'},
        {label: 'Intellectual Games Club', value: 'CJ158'},
        {label: 'Interact Club', value: 'CJ039'},
        {label: 'IT Club', value: 'CJ100'},
        {label: 'LDDS - Chinese', value: 'CJ078'},
        {label: 'LDDS - English', value: 'CJ027'},
        {label: 'Library', value: 'CJ198'},
        {label: 'Lion Dance Troupe', value: 'CJ047'},
        {label: 'Malay Cultural Society', value: 'CJ049'},
        {label: 'Mathematics Society', value: 'CJ050'},
        {label: 'Media Club', value: 'CJ196'},
        {label: 'Mind Sports Club', value: 'CJ203'},
        {label: 'Outdoor Activities Club', value: 'CJ052'},
        {label: 'Performing Arts Club', value: 'CJ121'},
        {label: 'Photographic Society', value: 'CJ054'},
        {label: 'Pottery Club', value: 'CJ056'},
        {label: 'Publications', value: 'CJ122'},
        {label: 'Red Cross Humanitarian Network', value: 'CJ165'},
        {label: 'Robotics Club', value: 'CJ123'},
        {label: 'Science & Environment Club', value: 'CJ222'},
        {label: 'Service Learning Club', value: 'CJ216'},
        {label: 'Singapore Youth Flying Club', value: 'CJ064'},
        {label: 'Strategic Games Club', value: 'CJ234'},
        {label: 'Weiqi Club', value: 'CJ183'},
        {label: 'Young Journalists Club', value: 'CJ229'}
      ]
    }],
    selected: [],
    categories: [{
      label: 'Physical Sports',
      icon: 'pool',
      values: ['CA004', 'CA005']
    }, {
      label: 'Uniformed Groups',
      icon: 'people',
      values: ['CB007', 'CB011']
    }, {
      label: 'Visual Arts',
      icon: 'photo_camera',
      values: ['CC026', 'CC034']
    }, {
      label: 'Music',
      icon: 'music_note',
      values: ['CC003', 'CC010']
    }, {
      label: 'Technology',
      icon: 'laptop_mac',
      values: ['CJ204', 'CJ123']
    }, {
      label: 'Outdoor & Nature',
      icon: 'nature_people',
      values: ['CA007', 'CA060']
    }, {
      label: 'Interest Groups',
      icon: 'weekend',
      values: ['CJ183', 'CJ075']
    }]
  },
  getters: {
    selectedDisplayText (state) {
      const label = []
      state.options.forEach(group => {
        group.ccas.forEach(cca => {
          if (optionsSelected(cca, state.selected)) label.push(cca.label)
        })
      })
      // using &nbsp; unicode as space char are collapsed by html
      return label.length > 4 ? label.length + ' selected'
        : label.join('\u00A0\u00A0OR\u00A0\u00A0')
    }
  }
}

export const distinctiveProgrammes = {
  state: {
    options: {
      label: 'School Distinctive Programmes',
      types: [
        {label: 'Aesthetics', value: 'Aesthetics'},
        {label: 'Business & Entrepreneurship', value: 'Business & Entrepreneurship'},
        {label: 'Community & Youth Leadership', value: 'Community & Youth Leadership'},
        {label: 'Community Service & Student Leadership', value: 'Community Service & Student Leadership'},
        {label: 'Humanities', value: 'Humanities'},
        {label: 'ICT', value: 'ICT'},
        {label: 'Innovation & Enterprise', value: 'Innovation & Enterprise'},
        {label: 'Interdisciplinary', value: 'Interdisciplinary'},
        {label: 'Languages', value: 'Languages'},
        {label: 'Mathematics', value: 'Mathematics'},
        {label: 'Music & Performing Arts', value: 'Music & Performing Arts'},
        {label: 'STEM', value: 'STEM'},
        {label: 'Science', value: 'Science'},
        {label: 'Sports & Outdoor Education', value: 'Sports & Outdoor Education'},
        {label: 'Visual Arts & Design', value: 'Visual Arts & Design'}
      ]
    },
    selected: []
  }
}

export const schoolTypes = {
  state: {
    options: {
      label: 'Type of School',
      types: [
        {label: 'Government / Government-aided', value: 'G'},
        {label: 'Independent Schools', value: 'I'},
        {label: 'Specialised Schools', value: 'S'},
        {label: "Boys' School", value: 'BOYS'},
        {label: "Girls' School", value: 'GIRLS'},
        {label: 'Co-ed School', value: 'COED'}
      ]
    },
    selected: []
  }
}

export const specialNeeds = {
  state: {
    options: {
      label: 'Special Needs Facilities',
      types: [
        {label: 'Hearing Loss', value: 'HL'},
        {label: 'Visual Impairment', value: 'VI'},
        {label: 'Physical Disability', value: 'PD'},
        {label: 'Mild Special Educational Needs', value: 'Mild SEN'}
      ]
    },
    selected: []
  }
}

export const extraOptions = {
  namespaced: true,
  getters: {
    selectedDisplayText (state, getters, rootState) {
      const n =
        rootState.distinctiveProgrammes.selected.length +
        rootState.schoolTypes.selected.length +
        rootState.specialNeeds.selected.length
      return n > 0 ? n + ' selected' : ''
    }
  }
}

export const psle = {
  state: {
    options: [
      {label: '100-109', value: '100'},
      {label: '110-119', value: '110'},
      {label: '120-129', value: '120'},
      {label: '130-139', value: '130'},
      {label: '140-149', value: '140'},
      {label: '150-159', value: '150'},
      {label: '160-169', value: '160'},
      {label: '170-179', value: '170'},
      {label: '180-189', value: '180'},
      {label: '190-199', value: '190'},
      {label: '200-209', value: '200'},
      {label: '210-219', value: '210'},
      {label: '220-229', value: '220'},
      {label: '230-239', value: '230'},
      {label: '240-249', value: '240'},
      {label: '250-259', value: '250'},
      {label: '260-269', value: '260'},
      {label: '270-279', value: '270'}
    ],
    selected: null
  }
}

export const l1r5 = {
  state: {
    options: [
      {label: '4 & below', value: '4'},
      {label: '5-6', value: '6'},
      {label: '7-8', value: '8'},
      {label: '9-10', value: '10'},
      {label: '11-12', value: '12'},
      {label: '13-14', value: '14'},
      {label: '15-16', value: '16'}
    ],
    selected: null
  }
}
