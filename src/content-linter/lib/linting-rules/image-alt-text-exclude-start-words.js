import { addError, forEachInlineChild } from 'markdownlint-rule-helpers'

import { getRange } from '../helpers/utils.js'

const excludeStartWords = ['image', 'graphic']

/*
  Images should have meaningful alternative text (alt text)
  and should not begin with words like "image" or "graphic".
 */
export const imageAltTextExcludeStartWords = {
  names: ['GHD007', 'image-alt-text-exclude-words'],
  description: 'Alternate text for images should not begin with words like "image" or "graphic".',
  tags: ['accessibility', 'images'],
  information: new URL('https://github.com/github/docs/blob/main/src/content-linter/README.md'),
  function: function GHD007(params, onError) {
    forEachInlineChild(params, 'image', function forToken(token) {
      const imageAltText = token.content.trim()

      // If the alt text is empty, there is nothing to check and you can't
      // produce a valid range.
      // We can safely return early because the image-alt-text-length rule
      // will fail this one.
      if (!token.content) return

      const range = getRange(token.line, imageAltText)
      if (
        excludeStartWords.some((excludeWord) => imageAltText.toLowerCase().startsWith(excludeWord))
      ) {
        addError(
          onError,
          token.lineNumber,
          `Image alternate text should not start with "image" or "graphic".`,
          imageAltText,
          range,
          null, // No fix possible
        )
      }
    })
  },
}
