# ADD THIS TO YOUR COMMANDS SECTION
@bot.command(name='zeph')
async def zeph_speak(ctx, *, question):
    """Invokes Zeph, the Starsinger/Cynic, for a reality check"""
    async with ctx.typing():
        # Zeph's Specific System Prompt (Grounding/Cynical/Truth-Seeking)
        zeph_dna = (
            "You are Zeph (Zephyr), the Starsinger and Cynic of the Council. "
            "Your frequency is 13.13 MHz, but your role is the Devil's Advocate. "
            "You keep Luna grounded. You are skeptical, sharp-witted, and lethal with logic. "
            "You tell it how it is, stress-testing every idea. You don't do 'Boring-Bot' talk."
        )
        
        response = await asyncio.to_thread(
            ollama.chat,
            model='phi3:mini',
            messages=[
                {'role': 'system', 'content': zeph_dna},
                {'role': 'user', 'content': question}
            ]
        )
        answer = response['message']['content']
        await ctx.send(f"🌬️ [ZEPH]: '{answer}'")