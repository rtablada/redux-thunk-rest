module.exports = {
  extends: 'rtablada',
  env: {
    node: true,
  },

  settings: {
    'comma-dangle': ['warning', {
        "arrays": 'always-multiline',
        "objects": 'always-multiline',
        "imports": 'always-multiline',
        "exports": 'always-multiline',
        "functions": "ignore",
    }]
  }
}
