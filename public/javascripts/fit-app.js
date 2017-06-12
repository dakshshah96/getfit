import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead';
import ajaxHeart from './modules/heart';

// type ahead functionality for search bar
typeAhead( $('.search') );

// heart user profiles
const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);