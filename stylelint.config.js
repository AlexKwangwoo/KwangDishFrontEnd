module.exports = {
  extends: ["stylelint-config-recommended"],

  rules: {
    "declaration-block-no-duplicate-custom-properties": true,
    "declaration-block-no-duplicate-properties": [
      true,
      {
        ignore: ["consecutive-duplicates-with-different-values"],
      },
    ],
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
