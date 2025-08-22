git客户端钩子脚本,在push提交前运行

```bash
#!/bin/sh
echo "拜谢拜谢拜谢拜谢"
echo "🚀 正在运行类型检查..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌❌❌❌❌❌❌❌ 类型检查失败！请修复类型错误后再推送。"
    echo "   你可以运行 'npm run type-check' 来查看详细错误信息"
    exit 1
else
    echo "✅ 类型检查通过！"
    exit 0
fi
```

或者直接运行

```bash
echo "IyEvYmluL3NoCmVjaG8gIuaLnOiwouaLnOiwouaLnOiwouaLnOiwoiIKZWNobyAi7aC97bqAIOato+WcqOi/kOihjOexu+Wei+ajgOafpS4uLiIKbnBtIHJ1biB0eXBlLWNoZWNrCmlmIFsgJD8gLW5lIDAgXTsgdGhlbgogICAgZWNobyAi4p2M4p2M4p2M4p2M4p2M4p2M4p2M4p2MIOexu+Wei+ajgOafpeWksei0pe+8geivt+S/ruWkjeexu+Wei+mUmeivr+WQjuWGjeaOqOmAgeOAgiIKICAgIGVjaG8gIiAgIOS9oOWPr+S7pei/kOihjCAnbnBtIHJ1biB0eXBlLWNoZWNrJyDmnaXmn6XnnIvor6bnu4bplJnor6/kv6Hmga8iCiAgICBleGl0IDEKZWxzZQogICAgZWNobyAi4pyFIOexu+Wei+ajgOafpemAmui/h++8gSIKICAgIGV4aXQgMApmaQ==" | base64 -d > .git/hooks/pre-push

chmod +x .git/hooks/pre-push
```
