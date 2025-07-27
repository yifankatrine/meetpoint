import { Card, Image, Text, Button } from '@mantine/core';
import pic1 from '../../assets/default.jpg';

const CardItem = () => {
    return (
        <Card
            shadow="sm"
            padding={30}
            radius={27}
            withBorder
            style={{ maxWidth: 300, maxHeight: 500, backgroundColor: 'transparent' }}
            styles={{
                root: {
                    fontFamily: "'Manrope', sans-serif",
                },
            }}
        >
            <Card.Section>
                <Image
                    src={pic1}
                    width={300}
                    height={244}
                    alt="Картинка"
                />
            </Card.Section>

            <Text
                fw={600}
                ff="inherit"
                style={{ fontSize: "20px", marginTop: "14px",}}
            >
                Название мероприятия
            </Text>

            <Text
                fw={200}
                ff="inherit"
                style={{marginTop: "4px",}}
            >
                Представьте себе, вот вы гуляете по уютным улочкам Томска, КАК ВДРУГ ваше внимание привлекает нечто необычное — старинный каменный столб.
            </Text>

            <Text
                ff="inherit"
                style={{ marginTop: "12px" }}
            >
                Адрес: Площадь Ленина
            </Text>

            <Button
                variant="filled"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
            >
                Подробнее
            </Button>
        </Card>
    );
};

export default CardItem;