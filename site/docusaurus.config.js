// @ts-check

const organizationName = "atlarge-research";
const projectName = "opendc";

const {themes} = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import("@docusaurus/types").Config} */
const config = {
    title: "OpenDC",
    tagline: "Collaborative Datacenter Simulation and Exploration for Everybody",
    url: process.env.DOCUSAURUS_URL || `https://${organizationName}.github.io`,
    baseUrl: process.env.DOCUSAURUS_BASE_PATH || `/${projectName}/`,
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",
    organizationName,
    projectName,

    i18n: {
        defaultLocale: "en",
        locales: ["en"]
    },

    presets: [
        [
            "classic",
            /** @type {import("@docusaurus/preset-classic").Options} */
            ({
                docs: {
                    path: "learn",
                    routeBasePath: "learn",
                    sidebarPath: require.resolve("./sidebars.js"),
                    editUrl: `https://github.com/${organizationName}/${projectName}-website/tree/main/site/`
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css")
                }
            })
        ]
    ],

    plugins: [
        [
            "content-docs",
            // /** @type {import("@docusaurus/plugin-content-docs").Options} */
            ({
                id: "community",
                path: "community",
                routeBasePath: "community",
                editUrl: `https://github.com/${organizationName}/${projectName}-website/tree/main/site/`,
                sidebarPath: require.resolve("./sidebars.js")
            })
        ],
        [
            "content-docs",
            ({
                id: "research",
                path: "research",
                routeBasePath: "research",
                editUrl: `https://github.com/${organizationName}/${projectName}-website/tree/main/site/`,
                sidebarPath: require.resolve("./sidebars.js")
            })
        ]
    ],

    themes: [
        [
            // Local search: the index is built together with the site, so no external service is needed.
            // Search only works in a production build (`npm run build && npm run serve`), not in `npm start`.
            // The index contains every page. src/theme/SearchBar and src/theme/SearchPage leave out the OpenDC2
            // results unless the visitor ticks "Include OpenDC2 results".
            require.resolve("@easyops-cn/docusaurus-search-local"),
            /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
            ({
                hashed: true,
                indexBlog: false,
                docsRouteBasePath: ["learn", "community", "research"],
                docsDir: ["learn", "community", "research"],
                // The OpenDC2 pages are marked noindex to keep them out of search engines, but should still be
                // searchable on the site itself.
                forceIgnoreNoIndex: true,
                highlightSearchTermsOnTargetPage: true
            })
        ]
    ],

    themeConfig:
    /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
        ({
            navbar: {
                title: "OpenDC",
                logo: {
                    alt: "OpenDC logo",
                    src: "/img/logo.svg"
                },
                items: [
                    {
                        type: "doc",
                        docId: "intro",
                        position: "left",
                        label: "Learn"
                    },
                    {
                        to: "/research/publications",
                        label: "Research",
                        position: "left",
                        activeBaseRegex: `/research/`
                    },
                    {
                        to: "/community/support",
                        label: "Community",
                        position: "left",
                        activeBaseRegex: `/community/`
                    },
                    {
                        href: "https://app.opendc.org",
                        html: "Log In",
                        position: "right",
                        className: "header-app-link button button--outline button--primary",
                        "aria-label": "OpenDC web application",
                    },
                    {
                        href: `https://github.com/${organizationName}/${projectName}`,
                        position: "right",
                        className: "header-github-link",
                        "aria-label": "GitHub repository",
                    },
                ]
            },
            footer: {
                style: "dark",
                links: [
                    {
                        title: "Learn",
                        items: [
                            {
                                label: "Getting Started",
                                to: "/learn/category/getting-started"
                            },
                            {
                                label: "Tutorials",
                                href: "https://github.com/atlarge-research/opendc-demos"
                            },
                            {
                                label: "Documentation",
                                to: "/learn/category/documentation"
                            }
                        ]
                    },
                    {
                        title: "Community",
                        items: [
                            {
                                label: "Support",
                                to: "/community/support"
                            },
                            {
                                label: "Team",
                                to: "/community/team"
                            },
                            {
                                label: "GitHub Discussions",
                                href: `https://github.com/${organizationName}/${projectName}/discussions`
                            }
                        ]
                    },
                    {
                        title: "Research",
                        items: [
                            {
                                label: "Publications",
                                to: "/research/publications"
                            },
                            {
                                label: "Projects",
                                to: "/research/research-projects"
                            },
                            {
                                label: "Students",
                                to: "/research/student-projects"
                            }
                        ]
                    },
                    {
                        title: "More",
                        items: [
                            {
                                label: "GitHub",
                                href: `https://github.com/${organizationName}/${projectName}`
                            },
                            {
                                label: "Uptime",
                                href: `https://stats.uptimerobot.com/Ngu1lPrzsm`
                            }
                        ]
                    }
                ],
                copyright: `Copyright © ${new Date().getFullYear()} AtLarge Research. Built with Docusaurus.`
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme
            }
        })
};

module.exports = config;
