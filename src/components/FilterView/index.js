import TabsForPrimary from './TabsForPrimary'
import TabsForPreschool from './TabsForPreschool'

export default process.env.VERSION === 'preschool' ? TabsForPreschool : TabsForPrimary

export {default as Mobile} from './TabsForPrimary/Mobile'
