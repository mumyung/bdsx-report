import { ActorCommandSelector } from "bdsx/bds/command"
import { Form } from "bdsx/bds/form"
import { ServerPlayer } from "bdsx/bds/player"
import { command } from "bdsx/command"
import { bedrockServer } from "bdsx/launcher"
import * as fs from "fs"

const ReportCommand = "신고"

command.register(ReportCommand, "플레이어를 신고 할 수 있습니다.").overload(async (params, origin, output) => {
    const actor = origin.getEntity();
    if (actor?.isPlayer()) {
        const NetId = actor.getNetworkIdentifier()
        for (const player of params.ReportTarget.newResults(origin, ServerPlayer)) {
            if (params.ReportTarget !== undefined) {
                let playerName = player.getName();
                const today = new Date();
                const years = today.getFullYear();
                const month = today.getMonth();
                const day = today.getDay();
                const hours = today.getHours();
                const minutes = today.getMinutes();
                const seconds = today.getSeconds();
                const res = await Form.sendTo(NetId, {
                    type: "custom_form",
                    title: "§l신고 창",
                    content: [
                        {
                            type: "input",
                            text: `§l§a${playerName}§e님의 신고 내용을 적어 주세요!`,
                            placeholder: "신고 내용 적는 곳"
                        }
                    ]
                })
                if (res === null) return;

                const Reportcontent = res[0];

                const UserFile = `../plugins/report/playerfile/${playerName}`;
                const UserJSON = `../plugins/report/playerfile/${playerName}/${years}-${month}-${day}-${hours}-${minutes}-${seconds}-${playerName}.json`;
                !fs.existsSync(UserFile) ? fs.mkdirSync(UserFile) : null;
                let report = {};
                report = { playerName: playerName, Reportcontent: Reportcontent }
                fs.writeFileSync(UserJSON, JSON.stringify(report));
                const read = JSON.parse(fs.readFileSync(UserJSON, "utf8"))
                if (read.Reportcontent !== undefined) {
                    bedrockServer.executeCommand(`tellraw "${playerName}" {"rawtext":[{"text":"§l§a당신은 ${actor.getName() || "???"}님에 의해 신고를 당했습니다! \n§l§e사유: ${Reportcontent || "§cError 404"}"}]}`,);
                    bedrockServer.executeCommand(`tellraw "${actor.getName()}" {"rawtext":[{"text":"§l§a${playerName || "???"}님에게 성공적으로 신고를 보냈습니다! \n§e§l사유: ${Reportcontent || "§cError 404"}"}]}`,);
                }
            }
        }
    }
}, {
    ReportTarget: ActorCommandSelector
})

const ReportCommandENG = "report"

command.register(ReportCommandENG, "Players can be reported.").overload(async (params, origin, output) => {
    const actor = origin.getEntity();
    if (actor?.isPlayer()) {
        const NetId = actor.getNetworkIdentifier()
        for (const player of params.ReportTarget.newResults(origin, ServerPlayer)) {
            if (params.ReportTarget !== undefined) {
                let playerName = player.getName();
                const today = new Date();
                const years = today.getFullYear();
                const month = today.getMonth();
                const day = today.getDay();
                const hours = today.getHours();
                const minutes = today.getMinutes();
                const seconds = today.getSeconds();
                const res = await Form.sendTo(NetId, {
                    type: "custom_form",
                    title: "§lReport UI",
                    content: [
                        {
                            type: "input",
                            text: `§l§a${playerName}§ePlease write your report!`,
                            placeholder: "Where to write the report"
                        }
                    ]
                })
                if (res === null) return;

                const Reportcontent = res[0];

                const UserFile = `../plugins/report/playerfile/${playerName}`;
                const UserJSON = `../plugins/report/playerfile/${playerName}/${years}-${month}-${day}-${hours}-${minutes}-${seconds}-${playerName}.json`;
                !fs.existsSync(UserFile) ? fs.mkdirSync(UserFile) : null;
                let report = {};
                report = { playerName: playerName, Reportcontent: Reportcontent }
                fs.writeFileSync(UserJSON, JSON.stringify(report));
                const read = JSON.parse(fs.readFileSync(UserJSON, "utf8"))
                if (read.Reportcontent !== undefined) {
                    bedrockServer.executeCommand(`tellraw "${playerName}" {"rawtext":[{"text":"§l§aYou have been reported! \n§l§ereason: ${Reportcontent || "§cError 404"}"}]}`,);
                    bedrockServer.executeCommand(`tellraw "${actor.getName()}" {"rawtext":[{"text":"§l§aThe report has been successfully sent to you. \n§d§l${playerName || "???"} \n§e§lreason: ${Reportcontent || "§cError 404"}"}]}`,);
                }
            }
        }
    }
}, {
    ReportTarget: ActorCommandSelector
})
