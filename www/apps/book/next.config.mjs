import mdx from "@next/mdx"
import rehypeMdxCodeProps from "rehype-mdx-code-props"
import rehypeSlug from "rehype-slug"
import {
  brokenLinkCheckerPlugin,
  localLinksRehypePlugin,
  cloudinaryImgRehypePlugin,
  pageNumberRehypePlugin,
  crossProjectLinksPlugin,
} from "remark-rehype-plugins"
import { sidebar } from "./sidebar.mjs"

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        crossProjectLinksPlugin,
        {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
          projectUrls: {
            resources: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "resources",
            },
            "user-guide": {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "user-guide",
            },
            ui: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "ui",
            },
            api: {
              url: process.env.NEXT_PUBLIC_RESOURCES_URL,
              path: "api",
            },
          },
          useBaseUrl:
            process.env.NODE_ENV === "production" ||
            process.env.VERCEL_ENV === "production",
        },
      ],
      [brokenLinkCheckerPlugin],
      [localLinksRehypePlugin],
      [
        rehypeMdxCodeProps,
        {
          tagName: "code",
        },
      ],
      [rehypeSlug],
      [
        cloudinaryImgRehypePlugin,
        {
          cloudinaryConfig: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
            flags: ["fl_lossy", "f_auto"],
            resize: {
              action: "pad",
              aspectRatio: "16:9",
            },
            roundCorners: 16,
          },
        },
      ],
      [
        pageNumberRehypePlugin,
        {
          sidebar: sidebar,
        },
      ],
    ],
    jsx: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  transpilePackages: ["docs-ui"],
  async rewrites() {
    return {
      fallback: [
        {
          source: "/resources",
          destination: `${
            process.env.NEXT_PUBLIC_RESOURCES_URL || "https://localhost:3001"
          }/resources`,
          basePath: false,
        },
        {
          source: "/resources/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_RESOURCES_URL || "https://localhost:3001"
          }/resources/:path*`,
          basePath: false,
        },
        {
          source: "/api/:path*",
          destination: `${
            process.env.NEXT_PUBLIC_API_URL || "https://localhost:3001"
          }/api/:path*`,
          basePath: false,
        },
        // TODO comment out once we have the user guide published
        // {
        //   source: "/user-guide",
        //   destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL}/user-guide`,
        //   basePath: false,
        // },
        // {
        //   source: "/user-guide/:path*",
        //   destination: `${process.env.NEXT_PUBLIC_USER_GUIDE_URL}/user-guide/:path*`,
        //   basePath: false,
        // },
      ],
    }
  },
  async redirects() {
    return [
      {
        source: "/v2/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ]
  },
}

export default withMDX(nextConfig)
