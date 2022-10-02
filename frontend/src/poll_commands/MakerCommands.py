import discord
from discord.ext import commands


class MCQuestion(object):
    def __init__(self, question, options):
        self.question = question
        self.options = options

    def as_embed(self, number):
        embed = discord.Embed(title=f"Question {number} (Multiple Choice)")
        embed.add_field(name="Question", value=self.question)
        embed.add_field(name="Options", value=self.options)
        return embed


class MCPollModal(discord.ui.Modal):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.add_item(discord.ui.InputText(label="Question"))
        self.add_item(discord.ui.InputText(label="Options(comma separated)", style=discord.InputTextStyle.long))
        self.val = None

    async def callback(self, interaction: discord.Interaction):
        self.val = MCQuestion(self.children[0].value, self.children[1].value)
        embed = discord.Embed(title="Question Added to Poll")
        embed.add_field(name="Question", value=self.children[0].value)
        embed.add_field(name="Options", value=self.children[1].value)

        await interaction.response.edit_message(embeds=[embed])


class OpenQuestion(object):
    def __init__(self, question):
        self.question = question

    def as_embed(self, number):
        embed = discord.Embed(title=f"Question {number} (Open Ended)")
        embed.add_field(name="Question", value=self.question)
        return embed


class OpenPollModal(discord.ui.Modal):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.add_item(discord.ui.InputText(label="Question", style=discord.InputTextStyle.long))
        self.val = None

    async def callback(self, interaction: discord.Interaction):
        self.val = OpenQuestion(self.children[0].value)
        embed = discord.Embed(title="Question Added to Poll")
        embed.add_field(name="Question", value=self.children[0].value)

        await interaction.response.edit_message(embeds=[embed])


class PollButtons(discord.ui.View):
    def __init__(self, poll_name, question_dict, *items):
        super().__init__(*items)
        self.poll_name = poll_name
        self.question_dict = question_dict

    @discord.ui.button(label="List Questions", row=2, style=discord.ButtonStyle.primary)
    async def list_button_callback(self, button: discord.Button, interaction: discord.Interaction):
        questions = self.question_dict[(interaction.guild_id, interaction.channel_id, self.poll_name)]
        embeds = []
        for i, v in enumerate(questions, 1):
            embeds.append(v.as_embed(i))
        await interaction.response.edit_message(embeds=embeds)

    # @discord.ui.select(
    #     placeholder="Select message to delete",
    #     max_values=1,
    #     min_values=1,
    #
    # )#TODO Finish Selectors
    @discord.ui.button(label="Add MC Question", row=0, style=discord.ButtonStyle.primary)
    async def mc_button_callback(self, button: discord.Button, interaction: discord.Interaction):
        new_modal = MCPollModal(title="Multiple Choice Form")
        await interaction.response.send_modal(new_modal)
        await new_modal.wait()
        try:
            self.question_dict[(interaction.guild_id, interaction.channel_id, self.poll_name)].append(new_modal.val)
        except KeyError:
            self.question_dict[(interaction.guild_id, interaction.channel_id, self.poll_name)] = [new_modal.val]

    @discord.ui.button(label="Add Open-Ended Question")
    async def open_button_callback(self, button: discord.Button, interaction: discord.Interaction):
        new_modal = OpenPollModal(title="Open Choice Form")
        await interaction.response.send_modal(new_modal)
        await new_modal.wait()
        try:
            self.question_dict[(interaction.guild_id, interaction.channel_id, self.poll_name)].append(new_modal.val)
        except KeyError:
            self.question_dict[(interaction.guild_id, interaction.channel_id, self.poll_name)] = [new_modal.val]


class MakerCommands(commands.Cog):
    ctx_parse = discord.ApplicationContext

    def __init__(self, bot: discord.Bot):
        self.bot = bot
        self.question_dict = {}

    @commands.slash_command(name="makepoll", guild_id=[1021553449210499133], description="makes a poll")
    async def make_poll(self, ctx: ctx_parse, poll_name: str):
        print(type(ctx.guild_id), type(ctx.channel_id))
        print(poll_name)
        await ctx.send(f'Buttons for poll {poll_name}: ',
                       view=PollButtons(poll_name=poll_name, question_dict=self.question_dict))
