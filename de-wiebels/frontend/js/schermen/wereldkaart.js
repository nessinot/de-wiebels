// Wereldkaart: voorlopig alleen een begroeting.

import { esc, maakEl } from '../dom.js';
import { staat } from '../opslag.js';

export const wereldkaart = {
  maak() {
    const p = staat.profiel;
    const el = maakEl(`
      <h1>Hallo ${esc(p.naam)}! <span class="avatar-groot">${p.avatar}</span></h1>
      <p class="ondertitel">De werelden komen eraan.</p>
    `);
    return { el };
  },
};
