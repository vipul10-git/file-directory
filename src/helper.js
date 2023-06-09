export const sampleData = [
  {
  name: "Files",
  type: "directory",
  noDelete:true,
  children: [
    {
      name: "index.js",
      type: "file",
    },
    {
      name: "app.js",
      type: "file",
    },
    {
      name: "style.css",
      type: "file",
    },
    {
      name: "index.html",
      type: "file",
    },
    {
      name: "src",
      type: "directory",
      children: [
        {
          name: "components",
          type: "directory",
          children: [
            {
              name: "Table",
              type: "directory",

              children: [
                {
                  name: "index.js",
                  type: "file",
                },
                {
                  name: "index.css",
                  type: "file",
                },
              ],
            },
            {
              name: "Grid",
              type: "directory",
              children: [
                {
                  name: "index.js",
                  type: "file",
                },
                {
                  name: "index.css",
                  type: "file",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "utils",
      type: "directory",
      children:[]
    },
    {
      name: "asset",
      type: "file",
    },
  ],
}
]
