var buttonIconURL = 'data:image/png;base64,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Oi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6YmRhODZmZWQtM2ViMC00NTgyLWEzZGUtMzBlN2IyMDI1NmFlIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhlZjM4ZWIxLThjYTYtNDM1Yy04N2RlLWEyNjlmZjRkMmRkYiIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmRhM2U0YWNkLTAyOWEtNDBmNy04ZTA5LWM3YTQxNWIyNTk0MyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iTGludXgiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjc3OTA5OTM2MDE0MDk4IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzIiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMzowMzowNFQwMTowNTozMy0wNTowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjM6MDM6MDRUMDE6MDU6MzMtMDU6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NjliODkyMi01NzRmLTQ1YjQtODE0OS03ZjBlNDBiZmViY2IiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTAzLTA0VDAxOjA1OjM2LTA1OjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PpR6PJMAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAAJYEAACWBAb4S6uMAAAAHdElNRQfnAwQGBSRKrgA7AAABU0lEQVQ4y81SsU4CQRR8e9ndXAi0higJhQU2xk4aS2tJ7iP8Ahu+wW/AAiSxMaGyg+KMNHcFhRcSvAS6E0j2gsfekZfLrhWFhAOsdKqXzMwrZgbgr0EAAGq12mm9Xr8sFovn+Xy+HMdxxTRNHkXRWZqmjDGmSqWSFwQBmqb5HkXR0PM8x7KsV9LpdJ6r1arFOQfGGKxWK6CUAucclFJAKQXDMIAQAkIIKBQKgIiglALXdV+g1WqdhGE40RtARD2fz/V0OtWLxWKT1rPZ7I0QkgMAgF6vdyGllPpAhGE4aTabxz/C6Pf7N4i417xcLj8bjUZ5a6KDweBul1lKKbvd7tXOWnzff9hmRkRl2/b1/l4JyQVBYG8G6jjO7cHjaLfbR0mSfK0f+L7/+OuFCSHc9YPxeHyfpTOyiDiOcX1rrT+ydDSLSNP0SQhR0VqL0Wg0hH+Lb2bHWGh05R6PAAAAAElFTkSuQmCC';
