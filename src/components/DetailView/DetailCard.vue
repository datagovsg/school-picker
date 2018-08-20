<template>
  <div class="card column no-shadow">
    <div class="card-title text-primary">
      <img class="logo" :src="logo" />
      <span>{{info.name}}</span>
      <a :href="info.website" target="_blank">website</a>
    </div>
    <div class="card-content">
      <div>
        <div>{{schoolSummary.schoolType}}</div>
        <dl>
          <dt>Mother Tongue Offered:</dt>
          <dd>{{schoolSummary.motherTongue}}</dd>

          <template v-if="schoolSummary.higherMT">
            <dt>Higher Mother Tongue Offered:</dt>
            <dd>{{schoolSummary.higherMT}}</dd>
          </template>

          <template v-if="schoolSummary.moeProgrammes">
            <dt>Special Programmes:</dt>
            <dd v-for="row in schoolSummary.moeProgrammes">
              <a v-if="row.href" :href="row.href" target="_blank">{{row.value}}</a>
              <span v-else>{{row.value}}</span>
            </dd>
          </template>

          <template v-if="p1Registration">
            <dt>
              {{p1Registration.year}} {{p1Registration.label}}:
              &nbsp;<a href="https://www.moe.gov.sg/admissions/primary-one-registration/vacancies"><small>(as at {{p1Registration.lastUpdated}})</small></a>
              <!-- &nbsp;<a href="https://www.moe.gov.sg/admissions/primary-one-registration/vacancies"><small style="color: red;">(application closed)</small></a> -->
            </dt>
            <dd>
              <table class="p1-registration">
                <template v-for="row in p1Registration.rows">
                  <template v-if="row.values">
                    <tr v-for="r in row.values" v-if="r.value">
                      <td style="padding-left: 10px;"><em>{{r.label}}</em></td>
                      <td>{{r.value}}</td>
                    </tr>
                  </template>
                  <tr v-else-if="row.value" :class="row.class">
                    <td>{{row.label}}</td>
                    <td>{{row.value}}</td>
                    <q-tooltip v-if="row.title"
                      anchor="bottom left"
                      self="top left"
                      :offset="[10, 5]">
                      <div>{{row.title}}</div>
                    </q-tooltip>
                  </tr>
                </template>
              </table>
            </dd>
          </template>

          <template v-if="cutOffPoints">
            <dt>{{cutOffPoints.year}} {{cutOffPoints.label}}:</dt>
            <dd>
              <table class="cop-details">
                <tr v-for="prog in cutOffPoints.rows">
                  <td>{{prog.programme}}</td>
                  <td>{{prog.lower}} - {{prog.upper}}</td>
                </tr>
              </table>
            </dd>
          </template>

          <template v-if="l1r5History">
            <dt>{{l1r5History.year}} {{l1r5History.label}}:</dt>
            <dd>
              <table class="l1r5-details">
                <tr v-for="prog in l1r5History.rows">
                  <td>{{prog.programme}}: </td>
                  <td>{{prog.lower}} - {{prog.upper}}</td>
                </tr>
              </table>
            </dd>
          </template>
        </dl>
      </div>

      <span class="action-bookmark cursor-pointer text-primary"
        :class="{'text-bookmark': bookmarked}"
        @click="$emit('bookmark', info.id)">
        <img :src="bookmarked ? '/assets/Star_Green.svg' : '/assets/Star_Blue.svg'" />
        Bookmark
      </span>

      <span class="action-traveltime" v-if="travelTime">
        <img src='/assets/Car.svg'/>
        {{travelTime}}
      </span>
    </div>

    <div class="list item-delimiter auto column text-primary">
      <q-collapsible ref="ccaAchievements" label="CCA ACHIEVEMENTS" :opened=true>
        <div>
        <!-- SYF achievements -->
          <div class="achivement-container" v-if="syfAchievements && syfAchievements.rows.length > 0">
            <dt>{{syfAchievements.label}}</dt>

            <table>
              <thead>
                <tr>
                  <td></td>
                  <td class="year-label" v-for="year in syfAchievements.awardYears">{{year}}</td>
                </tr>
              </thead>

              <tbody>
                <tr class="achievement-row"
                  v-for="row in syfAchievements.rows"
                  v-if="syfAchievements.awardYears.some(year => medalIcon[row.awards[year]])">
                  <td class="cca-label text-bold">{{row.category}}</td>
                  <td v-for="year in syfAchievements.awardYears">
                    <img v-if="medalIcon[row.awards[year]]" :src="medalIcon[row.awards[year]]" />
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="legend">
              <div>LEGEND</div>
              <div v-for="item in syfAchievements.legendItems" class="text-primary">
                <img :src="medalIcon[item]"/>{{item}}
              </div>
            </div>

          </div>

          <!-- Uniform group achievements -->
          <div class="achivement-container" v-if="buaAchievements && buaAchievements.rows.length > 0">
            <dt>{{buaAchievements.label}}</dt>

            <table>
              <thead>
                <tr>
                  <td></td>
                  <td class="year-label" v-for="year in buaAchievements.awardYears">{{year}}</td>
                </tr>
              </thead>

              <tbody>
                <tr class="achievement-row"
                  v-for="row in buaAchievements.rows"
                  v-if="buaAchievements.awardYears.some(year => medalIcon[row.awards[year]])">
                  <td class="cca-label text-bold">{{row.category}}</td>
                  <td v-for="year in buaAchievements.awardYears">
                    <img v-if="medalIcon[row.awards[year]]" :src="medalIcon[row.awards[year]]" />
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="legend">
              <div>LEGEND</div>
              <div v-for="item in buaAchievements.legendItems" class="text-primary">
                <img :src="medalIcon[item]"/>{{item}}
              </div>
            </div>
          </div>

          <!-- Sports & games achievements -->
          <div class="achivement-container" v-if="sportAchievements && sportAchievements.rows.length > 0">
            <dt>{{sportAchievements.label}}</dt>
            <table>
              <thead>
                <tr>
                  <td></td>
                  <td class="year-label" v-for="year in sportAchievements.awardYears">{{year}}</td>
                </tr>
              </thead>

              <tbody>
                <tr class="achievement-row"
                  v-for="row in sportAchievements.rows"
                  v-if="sportAchievements.awardYears.some(year => medalIcon[row.awards[year]])">
                  <td class="cca-label text-bold"><div>{{row.category}}</div><small class="text-italic">{{row.subCategory}}</small></td>
                  <td v-for="year in sportAchievements.awardYears">
                    <img v-if="medalIcon[row.awards[year]]" :src="medalIcon[row.awards[year]]" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="legend">
              <div>LEGEND</div>
              <div v-for="item in sportAchievements.legendItems" class="text-primary">
                <img :src="medalIcon[item]"/>{{item}}
              </div>
            </div>
          </div>
        </div>
      </q-collapsible>

      <q-collapsible v-if="distinctiveProgrammes" ref="distinctiveProgrammes" label="DISTINCTIVE PROGRAMMES">
        <template v-for="row in distinctiveProgrammes">
          <dt>{{row.label}}</dt>
          <dd>{{row.value}}</dd>
        </template>
      </q-collapsible>

      <q-collapsible ref="generalInfo" label="GENERAL INFO">
        <dl>
          <template v-for="row in generalInfo" v-if="row.value">
            <dt>{{row.label}}</dt>
            <template v-if="Array.isArray(row.value)">
              <dd v-for="value in row.value">{{value}}</dd>
            </template>
            <dd v-else>{{row.value}}</dd>
          </template>
        </dl>
      </q-collapsible>

      <q-collapsible ref="subjectsOffered" label="SUBJECTS">
        <div style="column-count: 2">
          <div v-for="subject in subjectsOffered">{{subject}}</div>
        </div>
      </q-collapsible>

      <q-collapsible ref="ccasOffered" label="CCAs">
        <div class="row wrap">
           <dl class="width-1of2" v-for="row in ccasOffered">
            <dt>{{row.label}}</dt>
            <dd v-for="value in row.values">
              {{value}}
            </dd>
          </dl>
        </div>
      </q-collapsible>

      <q-collapsible ref="contactInfo" label="CONTACT" class="text-primary">
        <dl>
          <template v-for="row in contactInfo" v-if="row.value">
            <dt>{{row.label}}</dt>
            <template v-if="row.href">
              <dd><a :href="row.href" :target="row.href.match(/^mailto/) ? null : '_blank'">
                {{row.value}}
              </a></dd>
            </template>
            <dd v-else>{{row.value}}</dd>
          </template>
        </dl>
      </q-collapsible>

      <q-collapsible ref="gettingThere" label="GETTING THERE">
        <dl>
          <template v-for="row in gettingThere" v-if="row.value">
            <dt>{{row.label}}</dt>
            <dd>{{row.value}}</dd>
          </template>
        </dl>
      </q-collapsible>

    </div>
    <div class="exit absolute-top-right cursor-pointer" @click="$emit('close')">
      <i class="text-grey">
        clear
      </i>
    </div>
  </div>
</template>

<script>
import omit from 'lodash/omit'
import max from 'lodash/max'
import maxBy from 'lodash/maxBy'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'

export default {
  props: {
    info: Object,
    bookmarked: Boolean
  },
  data () {
    return {
      medalIcon: {
        Distinction: '/assets/Gold.svg',
        Accomplishment: '/assets/Silver.svg',
        Recognition: '/assets/Bronze.svg',
        Gold: '/assets/Gold.svg',
        Silver: '/assets/Silver.svg',
        Bronze: '/assets/Bronze.svg',
        '1st': '/assets/Gold.svg',
        '2nd': '/assets/Silver.svg',
        '3rd': '/assets/Bronze.svg'
      }
    }
  },
  computed: {
    logo () {
      return 'http://sis.moe.gov.sg' + this.info.logo.slice(1)
    },
    distance () {
      if ('distance' in this.info) {
        if (this.info.distance >= 10000) return (this.info.distance / 1000).toFixed(0) + ' KM'
        else if (this.info.distance > 1000) return (this.info.distance / 1000).toFixed(1) + ' KM'
        else return this.info.distance.toFixed(0) + ' M'
      }
    },
    schoolSummary () {
      const schoolType = this.info.GeneralInformation['Type of School']
      const motherTongue = this.info.GeneralInformation['Mother Tongue']
      const higherMT = ['Higher Chinese', 'Higher Malay', 'Higher Tamil']
        .filter(subject => this.info.SubjectOffered.indexOf(subject) > -1)
        .join(' / ')
      let moeProgrammes = this.info.SpecialProgrammes['MOE Programmes']
      moeProgrammes = moeProgrammes && moeProgrammes.map(program => {
        if (program.match(/^Integrated Programme/)) {
          return {
            value: program.replace('Dual Track School', 'Dual Track'),
            href: 'https://www.moe.gov.sg/education/secondary/other/integrated-programme'
          }
        } else {
          return {value: program}
        }
      })
      return {
        schoolType,
        motherTongue,
        higherMT,
        moeProgrammes
      }
    },
    travelTime () {
      if ('travelTime' in this.info) {
        if (this.info.travelTime > 3600) return 'More than 1 hr'
        else return Math.ceil(this.info.travelTime / 60) + ' min'
      }
    },
    contactInfo () {
      return [
        {label: 'Email', value: this.info.email.toLowerCase(), href: 'mailto:' + this.info.email},
        {label: 'Address', value: this.info.address},
        {label: 'Telephone / Fax', value: (this.info.telephone || 'Not available') + ' / ' + (this.info.fax || 'Not available')}
      ]
    },
    gettingThere () {
      return [
        {label: 'Nearest MRT', value: this.info.mrt.join(', ')},
        {label: 'Bus Services', value: this.info.bus}
      ]
    },
    generalInfo () {
      const info = this.info.GeneralInformation
      return [
        {label: 'Type of School', value: info['Type of School']},
        {label: 'Mother Tongue', value: info['Mother Tongue']},
        {label: 'Principal', value: info['Principal']},
        {label: 'Vision', value: info['School Vision']},
        {label: 'Mission', value: this.info.GeneralInformation['School Mission']},
        {label: 'School Philosophy, Culture and Ethos', value: info['School Philosophy, Culture and Ethos']},
        {label: 'Affiliated Schools', value: info['Affiliated Schools']},
        {label: 'IP Partner Schools', value: info['IP Partner Schools']}
      ]
    },
    subjectsOffered () {
      return this.info.SubjectOffered
    },
    ccasOffered () {
      const info = this.info.Cca
      if (info && Object.keys(info).length > 0) {
        return Object.keys(info).map(label => ({label, values: info[label]}))
      } else {
        return [{label: 'None available', values: []}]
      }
    },
    distinctiveProgrammes () {
      const info = this.info.SpecialProgrammes && this.info.SpecialProgrammes['School Distinctive Programmes']
      return info && Object.keys(info).map(category => {
        return {label: category, value: info[category]}
      })
    },
    cutOffPoints () {
      if (this.info.PsleAggregateHistory && this.info.PsleAggregateHistory.length > 0) {
        const info = this.info.PsleAggregateHistory
        const currentYear = maxBy(info, 'year').year
        const rows = info
          .filter(row => row.year === currentYear)
          .filter(row => row.lower && row.upper)
        return {
          label: 'S1 Posting Exercise',
          year: currentYear - 1,
          rows
        }
      }
    },
    l1r5History () {
      if (this.info.L1R5History && this.info.L1R5History.length > 0) {
        const info = this.info.L1R5History
        const currentYear = maxBy(info, 'year').year
        const rows = info
          .filter(row => row.year === currentYear)
          .filter(row => row.lower && row.upper)
        return {
          label: 'Joint Admissions Exercise (JAE)',
          year: currentYear,
          rows
        }
      }
    },
    achievementHistory () {
      return this.info.AchievementHistory['Primary'] ||
             this.info.AchievementHistory['Secondary'] ||
             this.info.AchievementHistory['Junior College']
    },
    schoolAwards () {
      const info = this.achievementHistory

      if (info) {
        const currentYear = max(
          Object.keys(omit(info, ['Best Unit Award', 'SYF', 'Sports & Games Competition']))
        )

        if (currentYear) {
          return {
            label: currentYear + ' Awards',
            results: Object.keys(info[currentYear]).map(category => {
              return {
                category,
                awards: info[currentYear][category]
              }
            })
          }
        }
      }
    },
    syfAchievements () {
      const info = this.achievementHistory && this.achievementHistory['SYF']
      if (info) {
        const awardYears = ['2015', '2016', '2017']
        const legendItems = ['Distinction', 'Accomplishment', 'Recognition']
        const groupedbyCategory = groupBy(info, 'category')
        let rows = Object.keys(groupedbyCategory).map(category => {
          const groupedByYear = groupBy(groupedbyCategory[category], 'year')
          Object.keys(groupedByYear).forEach(year => {
            groupedByYear[year] = groupedByYear[year][0].award
          })
          return {category, awards: groupedByYear}
        })

        rows = rows = sortBy(rows, 'category')
          .filter(row => Object.keys(row.awards).some(year => {
            const award = row.awards[year]
            return awardYears.indexOf(year) > -1 && legendItems.indexOf(award) > -1
          }))

        return {
          label: 'Singapore Youth Festival (SYF)',
          awardYears,
          legendItems,
          rows
        }
      }
    },
    buaAchievements () {
      const info = this.achievementHistory && this.achievementHistory['Best Unit Award']
      if (info) {
        const groupedbyCategory = groupBy(info, 'category')
        let awardYears = ['2015', '2016', '2017']
        let legendItems = ['Gold', 'Silver', 'Bronze']
        let rows = Object.keys(groupedbyCategory).map(category => {
          const groupedByYear = groupBy(groupedbyCategory[category], 'year')
          Object.keys(groupedByYear).forEach(year => {
            groupedByYear[year] = groupedByYear[year][0].award
          })
          return {category, awards: groupedByYear}
        })

        rows = rows = sortBy(rows, 'category')
          .filter(row => Object.keys(row.awards).some(year => {
            const award = row.awards[year]
            return awardYears.indexOf(year) > -1 && legendItems.indexOf(award) > -1
          }))

        return {
          label: 'Best Unit Award',
          awardYears,
          legendItems,
          rows
        }
      }
    },
    sportAchievements () {
      const info = this.achievementHistory && this.achievementHistory['Sports & Games Competition']
      if (info) {
        const awardYears = ['2015', '2016', '2017']
        const legendItems = ['1st', '2nd', '3rd']

        let rows = []
        const groupedByCategory = groupBy(info, 'category')
        Object.keys(groupedByCategory).forEach(category => {
          const groupedBySub = groupBy(groupedByCategory[category], row => row.subCategory.join(','))
          Object.keys(groupedBySub).forEach(subCategory => {
            const groupedByYear = groupBy(groupedBySub[subCategory], 'year')
            Object.keys(groupedByYear).forEach(year => {
              groupedByYear[year] = groupedByYear[year][0].award
            })
            rows.push({category, subCategory, awards: groupedByYear})
          })
        })

        rows = sortBy(rows, 'category')
          .filter(row => Object.keys(row.awards).some(year => {
            const award = row.awards[year]
            return awardYears.indexOf(year) > -1 && legendItems.indexOf(award) > -1
          }))

        return {
          label: 'Sports & Games Competition',
          awardYears,
          legendItems,
          rows
        }
      }
    },
    p1Registration () {
      const info = this.info.p1Registration
      function getApplicants (phase) {
        if (!isNaN(info['NO. OF APPLICANTS IN ' + phase]) && !isNaN(info['VACANCY FOR ' + phase])) {
          return info['NO. OF APPLICANTS IN ' + phase] + ' out of ' + info['VACANCY FOR ' + phase]
        }
      }
      if (info) {
        const phases = Object.keys(info).filter(key => key.match(/^PLACES TAKEN UP TO/)).map(key => key.slice(19))
        const placesTaken = info['PLACES TAKEN UP TO ' + max(phases)]
        const rows = [
          {label: 'Total Vacancy', value: info['TOTAL VACANCY'], class: 'text-bold'},
          // {label: 'Reserved for Phase 2B & 2C', value: info['VACANCIES RESERVED FOR PHASE 2B AND 2C']},
          // {label: 'Reserved for Phase 2C', value: Math.floor((info['TOTAL VACANCY'] - placesTaken) / 2)},
          {
            label: 'Places Taken So Far',
            value: placesTaken,
            class: placesTaken >= info['TOTAL VACANCY'] && 'fully-booked',
            title: 'Up until Phase 2C\nResult of Phase 2C(S) will be out on 21 August 2018'
          },
          {
            values: [
              {label: 'Phase 1 applicants', value: getApplicants('PHASE 1')},
              {label: 'Phase 2A(1) applicants', value: getApplicants('PHASE 2A1')},
              {label: 'Phase 2A(2) applicants', value: getApplicants('PHASE 2A2')},
              {label: 'Phase 2B applicants', value: getApplicants('PHASE 2B')},
              {label: 'Phase 2C applicants', value: getApplicants('PHASE 2C')},
              {label: 'Phase 2C(S) applicants', value: getApplicants('PHASE 2C SUPPLEMENTARY')},
              {label: 'Phase 3 applicants', value: getApplicants('PHASE 3')}
            ]
          }
        ]
        return {
          label: 'P1 Registration Exercise',
          year: '2018',
          lastUpdated: '15 August 2018',
          rows
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "~style/variables.scss";

.picker-detail-card {
  margin-bottom: 0;
  font-size: 0.8em;

  .card-title {
    padding: 30px 28px 10px 36px;
    display: flex;
    align-items: center;
    margin-bottom: 5px!important;

    .logo {
      max-height: 40px;
      max-width: 40px;
      margin-right: 15px;
    }

    a {
      margin-left: 1em;
      font-size: 60%;
    }
  }

  .card-content {
    padding: 0 28px 30px 36px;

    dl {
      margin: 1em 0;
    }

    & > span {
      margin-right: 1em;

      img {
        height: 10px;
        margin-right: 5px;
      }
    }

    .fully-booked > td:last-child::after {
      content: "full";
      margin-left: 0.5em;
      color: red;
      font-size: 0.8em;
      font-weight: 500;
    }
  }

  .q-collapsible {
    overflow-y: auto;
    min-height: 69px;
    padding: 10px 20px;

    .item.item-link {
      height: auto;
      margin: -10px -20px;
      padding: 10px 20px;

      &:hover {
        background: rgba(0, 0, 0, 0.1)
      }

      .item-content {
        font-weight: 700;
        letter-spacing: 0.75px;
        margin-right: 0;
      }

    .item-secondary {
        display: none;
      }
    }

    .q-collapsible-sub-item {
      margin-top: 10px;
    }

    dl:last-child {
      margin-bottom: 0;
    }

    .achivement-container {
      padding-bottom: 20px;

      .legend {
        width: 100%;
        padding: 2px 5px;
        margin-top: 5px;
        border: 0.5px solid rgba(128, 128, 128, 0.25);

        div {
          padding: 3px 0px;
          display: inline-block;
          font-size: 0.8em;
          white-space: nowrap;
          vertical-align: middle;

          img {
            width: 10px;
            height: 10px;
            margin: 0 10px;
          }
        }
      }

      table {
        width: 100%;
        padding-top: 5px;
        border-collapse: collapse;

        tr {
          td {
            border: none;
            width: 45px;
            position: relative;

            &.year-label {
              text-align: center;
            }

            &.cca-label {
              width: 150px;
              padding: 5px 0 5px 10px;
            }

            img {
              margin-left: 20px;
              width: 12px;
              height: 12px;
            }
          }

          &:nth-child(2n) td{
            background: #f2f2f2;
          }
        }
      }
    }
  }

  dd ~ dt {
    margin-top: 1em;
  }

  dt {
    color: $color-secondary;
  }

  .cop-details,
  .l1r5-details,
  .p1-registration {
    width: 100%;

    td {
      width: 50%;
    }
  }

  .row.wrap {
    justify-content: space-between;
  }

  .width-1of2 {
    min-width: 0;
    flex-basis: 45%;
  }

  .exit {
    margin-top: 5px;
    margin-right: 5px;
    padding: 10px;
    font-size: 1.5em;
  }

  .item-content.has-secondary::after {
    content: '';
    position: absolute;
    display: inline-block;
    top: 18px;
    right: 15px;
    border-right: 2px solid grey;
    border-bottom: 2px solid grey;
    height: 8px;
    width: 8px;
    transform: rotate(45deg);
  }
}

.q-tooltip {
  padding: 7px;
  background-color: $color-primary;
  font-size: 10px;
  font-weight: 700;
  white-space: pre;
}
</style>
