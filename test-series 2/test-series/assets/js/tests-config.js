// List of all test folders and tests. Used by list pages, profile and admin panel.
export const GROUPS = [
  { prefix: 'fl', dir: 'full-length',   short: 'Full Length',   label: 'Full Length Test', count: 8, duration: 120, expected: 120,
    sections: [{ name: 'General Study', count: 30 }, { name: 'Physics', count: 90 }] },
  { prefix: 'gs', dir: 'general-study', short: 'General Study', label: 'GS Test',          count: 8, duration: 30,  expected: 30,
    sections: [{ name: 'General Study', count: 30 }] },
  { prefix: 'ph', dir: 'physics',       short: 'Physics',       label: 'Physics Test',     count: 7, duration: 60,  expected: 100,
    sections: [{ name: 'Physics', count: 100 }] }
];

export function allTests() {
  const out = [];
  GROUPS.forEach(g => {
    for (let i = 1; i <= g.count; i++) {
      out.push({ id: g.prefix + i, group: g, no: i, name: g.label + ' ' + i, page: g.dir + '/test' + i + '.html' });
    }
  });
  return out;
}
export function findTest(id) { return allTests().find(t => t.id === id) || null; }
