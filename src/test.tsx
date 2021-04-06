import { StarEmbed } from './utils/StarEmbed';


const embed = <embed color="RED">
    <title>This is the title</title>
    <field title="Field title">Field text</field>
    <field title="Other field title">Other field text</field>
    <field title="Inline field title" inline>Inline field text</field>
    <timestamp>{Date.now()}</timestamp>
    <timestamp />
    <footer>This is the footer</footer>
</embed>;

console.log(embed);