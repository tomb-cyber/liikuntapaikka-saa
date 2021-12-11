module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [ 
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'sourceType': 'module'
    },
    'plugins': [
        'react'
    ],
    'rules': {
        'indent': [
            'warn',
            4  
        ],
        'quotes': [
            'warn',
            'single'
        ],
        'semi': [
            'warn',
            'never'
        ],
        'eqeqeq': 'warn',
        'no-trailing-spaces': 'warn',
        'object-curly-spacing': [
            'warn', 'always'
        ],
        'arrow-spacing': [
            'warn', { 'before': true, 'after': true }
        ],
        'no-console': 0,
        'react/prop-types': 0,
        'no-unused-vars': 'warn'
    },
    'settings': {
        'react': {
            'version': 'detect'
        }
    }
}