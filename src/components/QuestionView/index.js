import SlidesForPrimary from './SlidesForPrimary'
import SlidesForPreschool from './SlidesForPreschool'

export default process.env.VERSION === 'preschool' ? SlidesForPreschool : SlidesForPrimary
