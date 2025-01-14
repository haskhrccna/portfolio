import navigation from './navigation';
import skills from './skills';
import contact from './contact';
import projects from './projects';
import certifications from './certifications';
import general from './general';

export default {
  translation: {
    ...navigation,
    ...skills,
    ...contact,
    ...projects,
    ...certifications,
    ...general
  }
};