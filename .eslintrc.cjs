// Generated with npm init @eslint/config
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": "standard-with-typescript",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        },
        // EDIT Added override for tests
        {
            "files": [
                "*.test.ts"
            ],
            "rules": {
                // Standard-TS override -- vitest helpers use any
                "@typescript-eslint/no-unsafe-argument": "off"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    // EDIT Added rules
    "rules": {
        // Standard-TS override -- Stroustrup is the GOAT
        "brace-style": "off",
        "@typescript-eslint/brace-style": ["error", "stroustrup"],

        // Standard-TS override -- Commas always create less diff when adding new elements
        "comma-dangle": "off",
        "@typescript-eslint/comma-dangle": ["error", "always-multiline"],

        // Standard-TS override -- We often export a type and a helper object with the same name
        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": "off",

        // Standard-TS override -- This one is just annoying and with TS we have good type safety there
        "strict-boolean-expressions": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
    },
}
