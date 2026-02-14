#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Theme metadata
const themes = {
  'death': { name: 'Death Metal - Death (Leprosy)', album: 'Leprosy (1988)' },
  'at-the-gates': { name: 'Death Metal - At the Gates', album: 'Slaughter of the Soul (1995)' },
  'autopsy': { name: 'Death Metal - Autopsy', album: 'Severed Survival (1989)' },
  'bolt-thrower': { name: 'Death Metal - Bolt Thrower', album: 'Those Once Loyal (2005)' },
  'cannibal-corpse': { name: 'Death Metal - Cannibal Corpse', album: 'Tomb of the Mutilated (1992)' },
  'carcass': { name: 'Death Metal - Carcass', album: 'Heartwork (1993)' },
  'dismember': { name: 'Death Metal - Dismember', album: 'Like an Ever Flowing Stream (1991)' },
  'entombed': { name: 'Death Metal - Entombed', album: 'Left Hand Path (1990)' },
  'morbid-angel': { name: 'Death Metal - Morbid Angel', album: 'Altars of Madness (1989)' }
};

// Read a Lua palette file and extract colors
function extractColors(luaFile) {
  const content = fs.readFileSync(luaFile, 'utf8');
  const colors = {};

  // Extract hex color assignments
  const regex = /(\w+)\s*=\s*"(#[0-9a-fA-F]{6})"/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    colors[match[1]] = match[2];
  }

  return colors;
}

// Generate Sublime Text color scheme JSON
function generateSublimeTheme(themeKey, colors, metadata) {
  return {
    name: metadata.name,
    author: "Death Metal Themes",
    variables: {
      // Base colors
      black: colors.bg || "#000000",
      white: colors.fg || "#c1c1c1",
      grey: colors.comment || "#505050",

      // Accent colors from album artwork
      accent1: colors.string,
      accent2: colors.type,

      // UI colors
      background: colors.bg || "#000000",
      foreground: colors.fg || "#c1c1c1",
      caret: colors.fg || "#c1c1c1",
      selection: colors.visual || "#333333",
      line_highlight: colors.line || "#111111",
    },
    globals: {
      background: "var(background)",
      foreground: "var(foreground)",
      caret: "var(caret)",
      line_highlight: "var(line_highlight)",
      selection: "var(selection)",
      selection_border: "var(selection)",
      inactive_selection: "#222222",
      misspelling: "var(accent2)",
      shadow: "#00000080",

      // Gutter
      gutter: "var(background)",
      gutter_foreground: "var(grey)",

      // Guides
      guide: "#333333",
      active_guide: "#555555",
      stack_guide: "#444444",

      // Brackets
      brackets_options: "underline",
      brackets_foreground: "var(accent1)",
      bracket_contents_options: "underline",
      bracket_contents_foreground: "var(accent1)",

      // Tags
      tags_options: "stippled_underline",
    },
    rules: [
      {
        name: "Comment",
        scope: "comment, punctuation.definition.comment",
        foreground: "var(grey)",
        font_style: "italic"
      },
      {
        name: "String",
        scope: "string",
        foreground: "var(accent1)"
      },
      {
        name: "Number",
        scope: "constant.numeric",
        foreground: colors.number || "var(white)"
      },
      {
        name: "Built-in constant",
        scope: "constant.language",
        foreground: colors.constant || "var(white)"
      },
      {
        name: "User-defined constant",
        scope: "constant.character, constant.other",
        foreground: colors.constant || "var(white)"
      },
      {
        name: "Variable",
        scope: "variable",
        foreground: "var(foreground)"
      },
      {
        name: "Keyword",
        scope: "keyword, keyword.operator.word",
        foreground: colors.keyword || "#999999"
      },
      {
        name: "Storage",
        scope: "storage",
        foreground: colors.keyword || "#999999"
      },
      {
        name: "Storage type",
        scope: "storage.type",
        foreground: "var(accent2)"
      },
      {
        name: "Class name",
        scope: "entity.name.class, entity.name.type",
        foreground: "var(accent2)"
      },
      {
        name: "Inherited class",
        scope: "entity.other.inherited-class",
        foreground: "var(accent2)"
      },
      {
        name: "Function name",
        scope: "entity.name.function",
        foreground: colors.func || "#888888"
      },
      {
        name: "Function argument",
        scope: "variable.parameter",
        foreground: colors.property || "var(foreground)"
      },
      {
        name: "Tag name",
        scope: "entity.name.tag",
        foreground: "var(accent2)"
      },
      {
        name: "Tag attribute",
        scope: "entity.other.attribute-name",
        foreground: colors.property || "var(foreground)"
      },
      {
        name: "Library function",
        scope: "support.function",
        foreground: colors.func || "#888888"
      },
      {
        name: "Library constant",
        scope: "support.constant",
        foreground: colors.constant || "var(white)"
      },
      {
        name: "Library class/type",
        scope: "support.type, support.class",
        foreground: "var(accent2)"
      },
      {
        name: "Library variable",
        scope: "support.other.variable",
        foreground: "var(foreground)"
      },
      {
        name: "Invalid",
        scope: "invalid",
        foreground: "#ffffff",
        background: colors.diag_red || "#ff0000"
      },
      {
        name: "Invalid deprecated",
        scope: "invalid.deprecated",
        foreground: "#ffffff",
        background: colors.diag_yellow || "#ffaa00"
      },
      {
        name: "Diff header",
        scope: "meta.diff, meta.diff.header",
        foreground: "var(grey)"
      },
      {
        name: "Diff deleted",
        scope: "markup.deleted",
        foreground: colors.diag_red || "#ff0000"
      },
      {
        name: "Diff inserted",
        scope: "markup.inserted",
        foreground: colors.diag_green || "#00ff00"
      },
      {
        name: "Diff changed",
        scope: "markup.changed",
        foreground: colors.diag_yellow || "#ffaa00"
      },
      {
        name: "Markup heading",
        scope: "markup.heading",
        foreground: "var(accent1)",
        font_style: "bold"
      },
      {
        name: "Markup italic",
        scope: "markup.italic",
        font_style: "italic"
      },
      {
        name: "Markup bold",
        scope: "markup.bold",
        font_style: "bold"
      },
      {
        name: "Markup underline",
        scope: "markup.underline",
        font_style: "underline"
      },
      {
        name: "Markup code",
        scope: "markup.raw",
        foreground: "var(accent1)"
      },
      {
        name: "Markup quote",
        scope: "markup.quote",
        foreground: "var(grey)",
        font_style: "italic"
      },
      {
        name: "Markup list",
        scope: "markup.list punctuation.definition.list_item",
        foreground: "var(accent1)"
      },
      {
        name: "Markup link",
        scope: "markup.underline.link",
        foreground: "var(accent2)"
      }
    ]
  };
}

// Main execution
const nvimPalettePath = path.join(__dirname, '..', 'death-metal-theme-neovim', 'lua', 'death-metal', 'palette');
const outputPath = path.join(__dirname, 'themes');

// Create output directory
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Generate themes
for (const [themeKey, metadata] of Object.entries(themes)) {
  const luaFile = path.join(nvimPalettePath, `${themeKey}.lua`);

  if (!fs.existsSync(luaFile)) {
    console.error(`Warning: ${luaFile} not found`);
    continue;
  }

  const colors = extractColors(luaFile);
  const sublimeTheme = generateSublimeTheme(themeKey, colors, metadata);

  const outputFile = path.join(outputPath, `${themeKey}.sublime-color-scheme`);
  fs.writeFileSync(outputFile, JSON.stringify(sublimeTheme, null, 2));

  console.log(`Generated: ${themeKey}.sublime-color-scheme`);
}

console.log('\nAll themes generated successfully!');
