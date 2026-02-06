import navigation from './navigation';
import skills from './skills';
import contact from './contact';
import projects from './projects';
import certifications from './certifications';
import general from './general';
import experience from './experience';

export default {
  translation: {
    ...navigation,
    ...skills,
    ...contact,
    ...projects,
    ...certifications,
    ...general,
    ...experience
  }
};
