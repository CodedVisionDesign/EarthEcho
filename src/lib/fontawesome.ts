import { library, config } from "@fortawesome/fontawesome-svg-core";

// Prevent FA from adding CSS automatically (we import it in layout.tsx)
config.autoAddCss = false;

// Solid icons
import {
  faSeedling,
  faChartLine,
  faDroplet,
  faEarthAmericas,
  faBagShopping,
  faRecycle,
  faCar,
  faShirt,
  faTrophy,
  faBullseye,
  faMedal,
  faComments,
  faLink,
  faFire,
  faBicycle,
  faPersonWalking,
  faArrowRight,
  faArrowTrendUp,
  faArrowTrendDown,
  faChevronDown,
  faCircleUser,
  faGear,
  faLeaf,
  faBars,
  faXmark,
  faEnvelope,
  faLock,
  faUser,
  faUserPlus,
  faRightToBracket,
  faPlus,
  faBath,
  faTrashCan,
  faTree,
  faSpinner,
  faCircleExclamation,
  faHand,
  faLayerGroup,
  faRoute,
  faAward,
  faUsers,
  faRocket,
  faBolt,
  faTrain,
  faBus,
  faPlane,
  faRightFromBracket,
  faCamera,
  faBookOpen,
  faSun,
  faShower,
  faCarrot,
  faLightbulb,
  faCircleInfo,
  faSearch,
  faPen,
  faCircleCheck,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// Brand icons
import {
  faGoogle,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

// Register all icons
library.add(
  // Solid
  faSeedling, faChartLine, faDroplet, faEarthAmericas, faBagShopping,
  faRecycle, faCar, faShirt, faTrophy, faBullseye, faMedal, faComments,
  faLink, faFire, faBicycle, faPersonWalking, faArrowRight, faArrowTrendUp,
  faArrowTrendDown, faChevronDown, faCircleUser, faGear, faLeaf, faBars,
  faXmark, faEnvelope, faLock, faUser, faUserPlus, faRightToBracket,
  faPlus, faBath, faTrashCan, faTree, faSpinner, faCircleExclamation,
  faHand, faLayerGroup, faRoute, faAward, faUsers, faRocket, faBolt,
  faTrain, faBus, faPlane, faRightFromBracket, faCamera,
  faBookOpen, faSun, faShower, faCarrot, faLightbulb, faCircleInfo,
  faSearch, faPen, faCircleCheck, faChevronLeft, faChevronRight,
  // Brands
  faGoogle, faFacebook
);

// Re-export commonly used icons for convenient importing
export {
  faSeedling, faChartLine, faDroplet, faEarthAmericas, faBagShopping,
  faRecycle, faCar, faShirt, faTrophy, faBullseye, faMedal, faComments,
  faLink, faFire, faBicycle, faPersonWalking, faArrowRight, faArrowTrendUp,
  faArrowTrendDown, faChevronDown, faCircleUser, faGear, faLeaf, faBars,
  faXmark, faEnvelope, faLock, faUser, faUserPlus, faRightToBracket,
  faPlus, faBath, faTrashCan, faTree, faSpinner, faCircleExclamation,
  faHand, faLayerGroup, faRoute, faAward, faUsers, faRocket, faBolt,
  faTrain, faBus, faPlane, faRightFromBracket, faCamera,
  faBookOpen, faSun, faShower, faCarrot, faLightbulb, faCircleInfo,
  faSearch, faPen, faCircleCheck, faChevronLeft, faChevronRight,
  faGoogle, faFacebook,
};
