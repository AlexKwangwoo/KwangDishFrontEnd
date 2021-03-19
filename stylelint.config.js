module.exports = {
  extends: ["stylelint-config-recommended"],

  rules: {
    "declaration-block-no-duplicate-properties": [true],
    "no-duplicate-selectors": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
  },
  ignore: [
    "consecutive-duplicates-with-different-values",
    "/regex/",
    "non-regex",
  ],
};
