/**
 * Tests for markdown rendering functionality
 * Tests renderMarkdown(), simpleMarkdownParse(), and escapeHtml() utilities
 */

describe('Markdown Rendering Utilities', () => {
    // Mock setup for testing without marked.js
    let originalMarked;
    let originalDOMPurify;

    beforeEach(() => {
        originalMarked = window.marked;
        originalDOMPurify = window.DOMPurify;
    });

    afterEach(() => {
        window.marked = originalMarked;
        window.DOMPurify = originalDOMPurify;
    });

    describe('escapeHtml()', () => {
        test('escapes HTML special characters', () => {
            const input = '<script>alert("xss")</script>';
            const result = escapeHtml(input);
            expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
            expect(result).not.toContain('<script>');
        });

        test('escapes ampersands', () => {
            const result = escapeHtml('Salt & Pepper');
            expect(result).toBe('Salt &amp; Pepper');
        });

        test('handles quotes', () => {
            const result = escapeHtml('She said "Hello"');
            expect(result).toBe('She said &quot;Hello&quot;');
        });

        test('returns empty string for null/undefined', () => {
            expect(escapeHtml(null)).toBe('');
            expect(escapeHtml(undefined)).toBe('');
        });
    });

    describe('simpleMarkdownParse()', () => {
        test('converts markdown bold to <strong>', () => {
            const input = 'This is **bold** text';
            const result = simpleMarkdownParse(input);
            expect(result).toContain('<strong>bold</strong>');
        });

        test('converts markdown italic to <em>', () => {
            const input = 'This is *italic* text';
            const result = simpleMarkdownParse(input);
            expect(result).toContain('<em>italic</em>');
        });

        test('converts markdown headings', () => {
            const input = '# Heading 1\n## Heading 2\n### Heading 3';
            const result = simpleMarkdownParse(input);
            expect(result).toContain('<h2>Heading 1</h2>');
            expect(result).toContain('<h3>Heading 2</h3>');
            expect(result).toContain('<h4>Heading 3</h4>');
        });

        test('converts markdown lists to HTML', () => {
            const input = '- Item 1\n- Item 2\n- Item 3';
            const result = simpleMarkdownParse(input);
            expect(result).toContain('<li>Item 1</li>');
            expect(result).toContain('<li>Item 2</li>');
            expect(result).toContain('<li>Item 3</li>');
        });

        test('preserves line breaks', () => {
            const input = 'Line 1\n\nLine 2';
            const result = simpleMarkdownParse(input);
            expect(result).toContain('<br>');
        });

        test('handles empty input', () => {
            expect(simpleMarkdownParse('')).toBe('');
            expect(simpleMarkdownParse(null)).toBe('');
            expect(simpleMarkdownParse(undefined)).toBe('');
        });

        test('does not convert HTML or unsupported syntax', () => {
            const input = '[Link](url) and `code`';
            const result = simpleMarkdownParse(input);
            // These are not in our limited feature set
            expect(result).toContain('[Link](url)'); // Not converted
        });
    });

    describe('renderMarkdown()', () => {
        test('uses marked.parse() when available', () => {
            const mockParse = jest.fn().mockReturnValue('<p>Test</p>');
            window.marked = { parse: mockParse };
            window.DOMPurify = { sanitize: jest.fn(x => x) };

            const result = renderMarkdown('Test');
            expect(mockParse).toHaveBeenCalledWith('Test');
            expect(result).toBe('<p>Test</p>');
        });

        test('sanitizes marked output with DOMPurify', () => {
            const mockParse = jest.fn().mockReturnValue('<p>Safe</p>');
            const mockSanitize = jest.fn(x => '<p>Sanitized</p>');
            window.marked = { parse: mockParse };
            window.DOMPurify = { sanitize: mockSanitize };

            renderMarkdown('Test');
            expect(mockSanitize).toHaveBeenCalledWith('<p>Safe</p>');
        });

        test('falls back to simpleMarkdownParse() when marked unavailable', () => {
            window.marked = undefined;
            const input = 'This is **bold**';
            const result = renderMarkdown(input);
            expect(result).toContain('<strong>bold</strong>');
        });

        test('returns escaped HTML on error', () => {
            const mockParse = jest.fn().mockImplementation(() => {
                throw new Error('Parse error');
            });
            window.marked = { parse: mockParse };
            window.DOMPurify = undefined;

            const input = '<script>alert("xss")</script>';
            const result = renderMarkdown(input);
            expect(result).toContain('&lt;script&gt;');
            expect(result).not.toContain('<script>');
        });

        test('handles null/undefined input', () => {
            expect(renderMarkdown(null)).toBe('');
            expect(renderMarkdown(undefined)).toBe('');
        });

        test('handles non-string input', () => {
            expect(renderMarkdown(123)).toBe('');
            expect(renderMarkdown({})).toBe('');
            expect(renderMarkdown([])).toBe('');
        });
    });

    describe('Real Markdown Examples', () => {
        test('renders Vevaphon Cellular Adaptation ability description', () => {
            // Simulate the actual markdown from the data
            const markdown = `**Innate Adaptation**: Through conscious cellular manipulation, a Vevaphon can attune their physiology to resist specific damage types.

- **Adaptation Limit**: Maximum 3 damage type adaptations active simultaneously
- **Protection**: Each active adaptation grants **+2 PV** against that damage type`;

            const result = renderMarkdown(markdown);
            expect(result).toBeTruthy();
            expect(result.length > 0).toBe(true);
        });

        test('renders Xeno Enhanced Reflexes ability description', () => {
            const markdown = `**Genetic Combat Enhancement**: Xenos are engineered with optimized neuromuscular systems for rapid response.

- **Initiative Bonus**: Xenos gain **+2 to Initiative rolls** in combat`;

            const result = renderMarkdown(markdown);
            expect(result).toBeTruthy();
            expect(result.length > 0).toBe(true);
        });
    });
});
